/**
 * @file smtp-client.ts
 * @description Production SMTP client singleton using nodemailer.
 * Configured for Plesk / IONOS mail server on SSL port 465.
 * @module infrastructure/email
 */

import nodemailer from "nodemailer";
import type { Transporter, SendMailOptions } from "nodemailer";

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

let cachedTransporter: Transporter | null = null;

/**
 * Returns a configured nodemailer Transporter singleton.
 */
export function getTransporter(): Transporter {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const config = getSmtpConfig();

  // Create transporter with pooling for high throughput and connection reuse
  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure, // true for 465 SSL
    auth: {
      user: config.user,
      pass: config.pass,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 5,
    connectionTimeout: 10000, // 10s
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: {
      // Reject unauthorized certificates in production
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });

  return cachedTransporter;
}

/**
 * Safe email dispatcher.
 * In development or when SMTP_PASS is unset, logs the email without crashing.
 * In production with SMTP_PASS set, sends directly via nodemailer transporter.
 */
export async function dispatchEmail(options: SendMailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = getSmtpConfig();

  // Default from field if not specified
  const mailOptions: SendMailOptions = {
    from: `"${config.fromName}" <${config.fromAddress}>`,
    ...options,
  };

  // If password is not provided (e.g. local development or unit test environment without secrets)
  if (!config.pass) {
    console.info(
      `[SMTP Client] (Mock/Dry-Run) Email not dispatched to remote server (SMTP_PASS not configured). Target: ${options.to}, Subject: "${options.subject}"`
    );
    return {
      success: true,
      messageId: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };
  }

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.info(`[SMTP Client] Successfully dispatched email to ${options.to}. MessageId: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
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
