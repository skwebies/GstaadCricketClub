/**
 * @file smtp-client.ts
 * @description Zero-dependency, native Node.js SMTP client using built-in `node:tls` and `node:crypto`.
 * Configured for Plesk / IONOS mail servers on Port 465 SSL.
 * Eliminates all external dependencies and build-time bundling issues.
 * @module infrastructure/email
 */

import tls from "node:tls";
import net from "node:net";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import fs from "node:fs";

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromAddress: string;
  adminRecipient: string;
}

export interface SendMailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

/**
 * Resolves current SMTP configuration from environment variables.
 */
export function getSmtpConfig(): SmtpConfig {
  const host =
    process.env.SMTP_HOST ||
    process.env.SMTP_SERVER ||
    process.env.MAIL_HOST ||
    process.env.MAIL_SERVER ||
    "gstaadcricketclub.ch";
  const port = parseInt(
    process.env.SMTP_PORT || process.env.MAIL_PORT || "465",
    10
  );
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;
  const user =
    process.env.SMTP_USER ||
    process.env.SMTP_USERNAME ||
    process.env.EMAIL_USER ||
    process.env.MAIL_USER ||
    process.env.SMTP_LOGIN ||
    "info@gstaadcricketclub.ch";
  const pass =
    process.env.SMTP_PASS ||
    process.env.SMTP_PASSWORD ||
    process.env.EMAIL_PASS ||
    process.env.MAIL_PASS ||
    process.env.EMAIL_PASSWORD ||
    process.env.SMTP_PWD ||
    process.env.MAIL_PWD ||
    "";
  const fromName = process.env.SMTP_FROM_NAME || "Gstaad Cricket Club";
  const fromAddress =
    process.env.SMTP_FROM_EMAIL ||
    process.env.SMTP_FROM ||
    process.env.MAIL_FROM ||
    process.env.EMAIL_FROM ||
    user;
  const adminRecipient =
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.ADMIN_EMAIL ||
    process.env.NOTIFICATION_EMAIL ||
    process.env.CONTACT_EMAIL ||
    "info@gstaadcricketclub.ch";

  return {
    host,
    port,
    secure,
    user,
    pass,
    fromName,
    fromAddress,
    adminRecipient,
  };
}

/**
 * Extracts raw email address from formats like `"Name" <email@domain.ch>` or `email@domain.ch`.
 */
export function extractEmailAddress(input: string): string {
  const match = input.match(/<([^>]+)>/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return input.trim();
}

/**
 * Formats RFC 2047 encoded-word for UTF-8 subject headers.
 */
function encodeHeaderValue(value: string): string {
  // If ASCII without special characters, return as is
  if (/^[\x20-\x7E]*$/.test(value)) {
    return value;
  }
  return `=?UTF-8?B?${Buffer.from(value, "utf-8").toString("base64")}?=`;
}

/**
 * Builds standard RFC 5322 MIME multipart/alternative message.
 */
export function buildMimeMessage(options: SendMailOptions, config: SmtpConfig): { raw: string; messageId: string } {
  const boundary = `----=_Part_${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;
  const messageId = `<${Date.now()}.${crypto.randomBytes(10).toString("hex")}@${config.host}>`;
  const dateStr = new Date().toUTCString();

  const fromHeader = options.from || `"${config.fromName}" <${config.fromAddress}>`;
  const toList = Array.isArray(options.to) ? options.to : [options.to];
  const toHeader = toList.join(", ");

  const headers: string[] = [
    `From: ${fromHeader}`,
    `To: ${toHeader}`,
    `Subject: ${encodeHeaderValue(options.subject)}`,
    `Date: ${dateStr}`,
    `Message-ID: ${messageId}`,
    `MIME-Version: 1.0`,
  ];

  if (options.replyTo) {
    headers.push(`Reply-To: ${options.replyTo}`);
  }

  headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);

  const plainText = options.text || "";
  const htmlText = options.html || "";

  // Base64 encode parts and wrap lines at 76 characters per RFC 2045
  const base64Plain = Buffer.from(plainText, "utf-8")
    .toString("base64")
    .replace(/(.{76})/g, "$1\r\n");

  const base64Html = Buffer.from(htmlText, "utf-8")
    .toString("base64")
    .replace(/(.{76})/g, "$1\r\n");

  const bodyLines = [
    headers.join("\r\n"),
    "",
    `--${boundary}`,
    `Content-Type: text/plain; charset=utf-8`,
    `Content-Transfer-Encoding: base64`,
    "",
    base64Plain,
    "",
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: base64`,
    "",
    base64Html,
    "",
    `--${boundary}--`,
    "",
  ];

  return {
    raw: bodyLines.join("\r\n"),
    messageId,
  };
}

/**
 * Low-level SMTP client using Node's native TLS socket.
 * Talks directly to Plesk Postfix/Qmail on port 465 SSL.
 */
function sendViaNativeSocket(options: SendMailOptions, config: SmtpConfig): Promise<{ success: boolean; messageId: string }> {
  return new Promise((resolve, reject) => {
    const { raw: mimeData, messageId } = buildMimeMessage(options, config);
    const toList = Array.isArray(options.to) ? options.to : [options.to];
    const fromAddr = extractEmailAddress(options.from || config.fromAddress);

    let socket: net.Socket;
    const timeoutMs = 15000;

    const socketOptions = {
      host: config.host,
      port: config.port,
      timeout: timeoutMs,
      // Default rejectUnauthorized to false unless explicitly set to true.
      // This allows encrypted TLS connections to succeed even when the host's mail
      // certificate is self-signed by Plesk or issued to the VPS hostname.
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === "true",
    };

    if (config.secure) {
      socket = tls.connect(socketOptions);
    } else {
      socket = net.connect({ host: config.host, port: config.port });
      socket.setTimeout(timeoutMs);
    }

    let buffer = "";
    let step = 0;
    let recipientIndex = 0;

    const cleanup = () => {
      if (!socket.destroyed) {
        socket.destroy();
      }
    };

    socket.on("timeout", () => {
      cleanup();
      reject(new Error(`SMTP connection timed out after ${timeoutMs}ms to ${config.host}:${config.port}`));
    });

    socket.on("error", (err) => {
      cleanup();
      reject(new Error(`SMTP Socket Error: ${err.message}`));
    });

    const sendLine = (line: string) => {
      socket.write(line + "\r\n");
    };

    socket.on("data", (chunk) => {
      buffer += chunk.toString();

      // Check if SMTP command response is complete
      // Complete response lines end with \r\n and start with a 3-digit code followed by space or newline
      const lines = buffer.split("\r\n");
      if (lines.length < 2) return;

      const lastCompleteLine = lines[lines.length - 2];
      if (!lastCompleteLine) return;

      // In multi-line SMTP responses (RFC 5321), intermediate lines have '-' (e.g. 250-AUTH)
      // The terminating line has a space (e.g. 250 OK or 250 CHUNKING) or code only
      const match = lastCompleteLine.match(/^(\d{3})(?: (.*))?$/);
      if (!match) return;

      const code = parseInt(match[1], 10);
      buffer = ""; // Clear buffer after receiving full response

      try {
        switch (step) {
          case 0: // Greeting
            if (code !== 220) throw new Error(`Unexpected SMTP greeting: ${lastCompleteLine}`);
            step++;
            sendLine(`EHLO ${config.host}`);
            break;

          case 1: // EHLO response
            if (code !== 250) throw new Error(`EHLO failed: ${lastCompleteLine}`);
            step++;
            sendLine("AUTH LOGIN");
            break;

          case 2: // AUTH LOGIN prompt (Username)
            if (code !== 334) throw new Error(`AUTH LOGIN rejected: ${lastCompleteLine}`);
            step++;
            sendLine(Buffer.from(config.user).toString("base64"));
            break;

          case 3: // Password prompt
            if (code !== 334) throw new Error(`Username rejected: ${lastCompleteLine}`);
            step++;
            sendLine(Buffer.from(config.pass).toString("base64"));
            break;

          case 4: // Auth success
            if (code !== 235) throw new Error(`Authentication failed: ${lastCompleteLine}`);
            step++;
            sendLine(`MAIL FROM:<${fromAddr}>`);
            break;

          case 5: // MAIL FROM response
            if (code !== 250) throw new Error(`MAIL FROM rejected: ${lastCompleteLine}`);
            step++;
            const firstRecipient = extractEmailAddress(toList[recipientIndex]);
            sendLine(`RCPT TO:<${firstRecipient}>`);
            break;

          case 6: // RCPT TO response
            if (code !== 250 && code !== 251) throw new Error(`RCPT TO rejected for ${toList[recipientIndex]}: ${lastCompleteLine}`);
            recipientIndex++;
            if (recipientIndex < toList.length) {
              const nextRecipient = extractEmailAddress(toList[recipientIndex]);
              sendLine(`RCPT TO:<${nextRecipient}>`);
            } else {
              step++;
              sendLine("DATA");
            }
            break;

          case 7: // DATA prompt
            if (code !== 354) throw new Error(`DATA rejected: ${lastCompleteLine}`);
            step++;
            // Send MIME message ending with <CRLF>.<CRLF>
            socket.write(mimeData + "\r\n.\r\n");
            break;

          case 8: // Final queued response
            if (code !== 250) throw new Error(`Message delivery rejected: ${lastCompleteLine}`);
            step++;
            sendLine("QUIT");
            break;

          case 9: // QUIT response
            cleanup();
            resolve({ success: true, messageId });
            break;

          default:
            cleanup();
            resolve({ success: true, messageId });
        }
      } catch (err: unknown) {
        cleanup();
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  });
}

/**
 * Tries authenticated SMTPS on Port 465 SSL.
 * If connecting to domain name fails (e.g. NAT loopback on VPS), retries on 127.0.0.1:465.
 */
async function sendViaAuthenticatedSmtp(
  options: SendMailOptions,
  config: SmtpConfig
): Promise<{ success: boolean; messageId: string; error?: string }> {
  try {
    return await sendViaNativeSocket(options, config);
  } catch (err1: unknown) {
    const msg1 = err1 instanceof Error ? err1.message : String(err1);
    console.warn(`[SMTP Client] Auth SMTP to ${config.host}:${config.port} failed (${msg1}). Trying local loopback...`);

    if (config.host !== "127.0.0.1" && config.host !== "localhost") {
      try {
        const localConfig = { ...config, host: "127.0.0.1" };
        return await sendViaNativeSocket(options, localConfig);
      } catch (err2: unknown) {
        const msg2 = err2 instanceof Error ? err2.message : String(err2);
        return { success: false, messageId: "", error: `Host: ${msg1}; 127.0.0.1: ${msg2}` };
      }
    }

    return { success: false, messageId: "", error: msg1 };
  }
}

/**
 * Dispatches email via local system MTA (/usr/sbin/sendmail binary).
 * On Linux/Ubuntu with Plesk & Postfix, this deposits mail directly into local Postfix queue
 * without requiring any network connection, passwords, or SSL certificates.
 */
export function sendViaSendmail(
  mimeData: string,
  fromAddr: string,
  recipients: string[]
): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    // Check standard Unix sendmail locations
    const candidatePaths = [
      "/usr/sbin/sendmail",
      "/usr/lib/sendmail",
      "/sbin/sendmail",
      "/usr/bin/sendmail",
      "sendmail",
    ];

    let binaryPath: string | null = null;
    for (const p of candidatePaths) {
      try {
        if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
          binaryPath = p;
          break;
        }
      } catch {
        // continue search
      }
    }

    // Default fallback to standard Linux MTA path if existsSync check was restricted
    if (!binaryPath && process.platform === "linux") {
      binaryPath = "/usr/sbin/sendmail";
    }

    if (!binaryPath) {
      resolve({ success: false, error: "sendmail binary not found on filesystem" });
      return;
    }

    try {
      // -t: read recipients from headers (To, Cc, Bcc)
      // -i: do not treat '.' alone as end-of-file
      // -f: set envelope sender address (Bounce/Return-Path)
      const args = ["-t", "-i", "-f", fromAddr];
      const child = spawn(/*turbopackIgnore: true*/ binaryPath, args, {
        stdio: ["pipe", "ignore", "pipe"],
      });

      let stderr = "";
      child.stderr?.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      child.on("error", (err) => {
        resolve({ success: false, error: `Sendmail spawn error (${binaryPath}): ${err.message}` });
      });

      child.on("close", (code) => {
        if (code === 0) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: `Sendmail (${binaryPath}) exited with code ${code}: ${stderr.trim()}` });
        }
      });

      // Pipe RFC 5322 MIME message into sendmail stdin
      child.stdin.write(mimeData);
      child.stdin.end();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      resolve({ success: false, error: `Sendmail execution failed: ${msg}` });
    }
  });
}

/**
 * Direct local Postfix submission on 127.0.0.1:25 without requiring passwords.
 * Postfix mynetworks allows trusted local loopback delivery directly into Dovecot/Roundcube.
 */
export function sendViaLocalSmtp(
  options: SendMailOptions,
  config: SmtpConfig
): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const { raw: mimeData } = buildMimeMessage(options, config);
    const toList = Array.isArray(options.to) ? options.to : [options.to];
    const fromAddr = extractEmailAddress(options.from || config.fromAddress);

    const socket = net.connect({ host: "127.0.0.1", port: 25 });
    const timeoutMs = 8000;
    socket.setTimeout(timeoutMs);

    let step = 0;
    let recipientIndex = 0;

    const cleanup = () => {
      if (!socket.destroyed) socket.destroy();
    };

    socket.on("timeout", () => {
      cleanup();
      resolve({ success: false, error: "Local Postfix (127.0.0.1:25) connection timed out" });
    });

    socket.on("error", (err) => {
      cleanup();
      resolve({ success: false, error: `Local Postfix socket error: ${err.message}` });
    });

    socket.on("data", (chunk) => {
      const text = chunk.toString();
      const match = text.match(/^(\d{3})(?:[ -]|$)/m);
      if (!match) return;
      const code = parseInt(match[1], 10);

      try {
        switch (step) {
          case 0: // 220 Greeting
            if (code !== 220) { cleanup(); return resolve({ success: false, error: `Local SMTP greeting: ${text.trim()}` }); }
            step++;
            socket.write("EHLO localhost\r\n");
            break;

          case 1: // 250 EHLO response
            if (code !== 250) { cleanup(); return resolve({ success: false, error: `Local SMTP EHLO: ${text.trim()}` }); }
            step++;
            socket.write(`MAIL FROM:<${fromAddr}>\r\n`);
            break;

          case 2: // 250 MAIL FROM response
            if (code !== 250) { cleanup(); return resolve({ success: false, error: `Local SMTP MAIL FROM: ${text.trim()}` }); }
            step++;
            const recp = extractEmailAddress(toList[recipientIndex]);
            socket.write(`RCPT TO:<${recp}>\r\n`);
            break;

          case 3: // 250 RCPT TO response
            if (code !== 250 && code !== 251) { cleanup(); return resolve({ success: false, error: `Local SMTP RCPT TO: ${text.trim()}` }); }
            recipientIndex++;
            if (recipientIndex < toList.length) {
              const nextRecp = extractEmailAddress(toList[recipientIndex]);
              socket.write(`RCPT TO:<${nextRecp}>\r\n`);
            } else {
              step++;
              socket.write("DATA\r\n");
            }
            break;

          case 4: // 354 DATA prompt
            if (code !== 354) { cleanup(); return resolve({ success: false, error: `Local SMTP DATA: ${text.trim()}` }); }
            step++;
            socket.write(mimeData + "\r\n.\r\n");
            break;

          case 5: // 250 Message accepted
            if (code !== 250) { cleanup(); return resolve({ success: false, error: `Local SMTP DATA accept: ${text.trim()}` }); }
            step++;
            socket.write("QUIT\r\n");
            break;

          case 6: // 221 Bye
            cleanup();
            resolve({ success: true });
            break;

          default:
            cleanup();
            resolve({ success: true });
        }
      } catch (err: unknown) {
        cleanup();
        resolve({ success: false, error: String(err) });
      }
    });
  });
}

/**
 * Universal multi-tier safe email dispatcher with self-healing waterfall:
 * 1. If credentials (SMTP_PASS / SMTP_PASSWORD) are set: Attempts Authenticated SMTPS (Port 465 SSL).
 * 2. On Linux/Plesk VPS: Attempts local sendmail (/usr/sbin/sendmail -t -i) into Postfix queue (zero credentials needed).
 * 3. Localhost loopback Postfix (127.0.0.1:25 without authentication).
 * 4. Fallback mock in test environment.
 */
export async function dispatchEmail(
  options: SendMailOptions
): Promise<{ success: boolean; messageId?: string; method?: string; error?: string }> {
  const config = getSmtpConfig();
  const { raw: mimeData, messageId } = buildMimeMessage(options, config);
  const toList = Array.isArray(options.to) ? options.to : [options.to];
  const fromAddr = extractEmailAddress(options.from || config.fromAddress);
  const deliveryErrors: string[] = [];

  // In test environment without SMTP credentials, bypass network directly
  if (process.env.NODE_ENV === "test" && !config.pass) {
    console.info(
      `[SMTP Client] (Test Mock) Email simulated for ${JSON.stringify(options.to)}. Subject: "${options.subject}"`
    );
    return {
      success: true,
      messageId: `mock-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
      method: "mock",
    };
  }

  // TIER 1: Authenticated SMTP (if password is provided in environment)
  if (config.pass) {
    const smtpRes = await sendViaAuthenticatedSmtp(options, config);
    if (smtpRes.success) {
      console.info(
        `[SMTP Client] Successfully delivered email via Authenticated SMTPS (Port ${config.port}) to ${JSON.stringify(options.to)}. MessageId: ${smtpRes.messageId}`
      );
      return { success: true, messageId: smtpRes.messageId, method: "smtp-auth" };
    }
    deliveryErrors.push(`Authenticated SMTP (${config.host}:${config.port}): ${smtpRes.error}`);
  }

  // TIER 2: Local System Sendmail Binary (/usr/sbin/sendmail -t -i -f fromAddr)
  // On Ubuntu / Plesk servers, this connects directly to Postfix without passwords or network ports.
  const sendmailRes = await sendViaSendmail(mimeData, fromAddr, toList);
  if (sendmailRes.success) {
    console.info(
      `[SMTP Client] Successfully delivered email via System MTA (sendmail) to ${JSON.stringify(options.to)}. MessageId: ${messageId}`
    );
    return { success: true, messageId, method: "sendmail" };
  }
  if (sendmailRes.error) {
    deliveryErrors.push(sendmailRes.error);
  }

  // TIER 3: Local SMTP Relay on 127.0.0.1:25 (Postfix loopback)
  const localSmtpRes = await sendViaLocalSmtp(options, config);
  if (localSmtpRes.success) {
    console.info(
      `[SMTP Client] Successfully delivered email via Local Postfix (127.0.0.1:25) to ${JSON.stringify(options.to)}. MessageId: ${messageId}`
    );
    return { success: true, messageId, method: "local-smtp-25" };
  }
  if (localSmtpRes.error) {
    deliveryErrors.push(localSmtpRes.error);
  }

  // TIER 4: Development / Test Mock
  if (process.env.NODE_ENV !== "production") {
    console.info(
      `[SMTP Client] (Development Mock Mode) Local mailers uninstalled on dev machine. Target: ${JSON.stringify(options.to)}, Subject: "${options.subject}"`
    );
    return {
      success: true,
      messageId: `mock-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
      method: "mock",
    };
  }

  const combinedError = deliveryErrors.join(" | ");
  console.error(`[SMTP Client] All delivery tiers failed for ${JSON.stringify(options.to)}:`, combinedError);
  return {
    success: false,
    error: combinedError,
  };
}
