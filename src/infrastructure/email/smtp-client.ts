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
  const host = process.env.SMTP_HOST || "gstaadcricketclub.ch";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
  const user = process.env.SMTP_USER || "info@gstaadcricketclub.ch";
  const pass = process.env.SMTP_PASS || "";
  const fromName = process.env.SMTP_FROM_NAME || "Gstaad Cricket Club";
  const fromAddress = process.env.SMTP_FROM_EMAIL || user;
  const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || "info@gstaadcricketclub.ch";

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
      // In production rejectUnauthorized is true; in dev allow flexibility
      rejectUnauthorized: process.env.NODE_ENV === "production",
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
      // Complete response lines start with a 3-digit code followed by space or newline
      const lines = buffer.split("\r\n");
      const lastCompleteLine = lines[lines.length - 2];

      if (!lastCompleteLine) return;

      // In multi-line SMTP responses, intermediate lines have '-' (e.g. 250-AUTH)
      // The terminating line has a space (e.g. 250 OK)
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
 * Universal safe email dispatcher.
 * In development or when SMTP_PASS is unset, logs the email without network requests.
 * In production with SMTP_PASS set, sends directly via native TLS socket over Port 465 SSL.
 */
export async function dispatchEmail(options: SendMailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = getSmtpConfig();

  // If password is not provided (e.g. local development or unit test environment without secrets)
  if (!config.pass) {
    console.info(
      `[SMTP Client] (Mock/Dry-Run) Email not dispatched to remote server (SMTP_PASS not configured). Target: ${options.to}, Subject: "${options.subject}"`
    );
    return {
      success: true,
      messageId: `mock-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
    };
  }

  try {
    const result = await sendViaNativeSocket(options, config);
    console.info(`[SMTP Client] Successfully delivered email to ${options.to}. MessageId: ${result.messageId}`);
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`[SMTP Client] Failed to send email to ${options.to}:`, errMsg);
    return {
      success: false,
      error: errMsg,
    };
  }
}
