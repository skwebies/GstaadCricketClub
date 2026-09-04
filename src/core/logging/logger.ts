/**
 * @file logger.ts
 * @description Centralized, production-grade structured logging system for Gstaad Cricket Club.
 * Provides standardized formatting, timestamps, severity levels, and automated sanitization
 * of sensitive credentials, payment tokens, and cryptographic keys.
 * @module core/logging
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogPayload {
  /** Brief human-readable description of the log event */
  message: string;
  /** Domain context or subsystem (e.g., 'AUTH', 'REGISTRATION', 'PAYMENT', 'DB') */
  context?: string;
  /** Arbitrary structured metadata to accompany the log entry */
  metadata?: Record<string, unknown>;
  /** Error instance if an exception was caught */
  error?: Error | unknown;
}

/**
 * Strips potentially sensitive keys from log metadata before writing to stdout/stderr.
 *
 * @param {Record<string, unknown>} meta - Raw metadata object
 * @returns {Record<string, unknown>} Sanitized metadata safe for cloud log ingestion
 */
function sanitizeMetadata(meta?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!meta) return undefined;

  const sensitiveKeys = ["password", "token", "secret", "authorization", "cookie", "service_role"];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(meta)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeMetadata(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Standard structured logger with uniform JSON output for cloud observability.
 */
class Logger {
  private format(level: LogLevel, payload: LogPayload): string {
    const entry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      context: payload.context || "APP",
      message: payload.message,
      metadata: sanitizeMetadata(payload.metadata),
      error: payload.error instanceof Error ? {
        name: payload.error.name,
        message: payload.error.message,
        stack: payload.error.stack,
      } : payload.error ? String(payload.error) : undefined,
    };

    return JSON.stringify(entry);
  }

  /**
   * Records a debug trace event for local diagnostic evaluation.
   *
   * @param {string} message - Descriptive debug note
   * @param {LogPayload} [payload] - Context and metadata
   */
  debug(message: string, payload?: Omit<LogPayload, "message">): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${message}`, payload?.metadata || "");
    }
  }

  /**
   * Records an informational business milestone (e.g. successful registration, member joined).
   *
   * @param {string} message - Informational summary
   * @param {LogPayload} [payload] - Associated domain context and metadata
   */
  info(message: string, payload?: Omit<LogPayload, "message">): void {
    console.log(this.format("info", { message, ...payload }));
  }

  /**
   * Records an operational anomaly or non-critical condition (e.g. rate limit approaching).
   *
   * @param {string} message - Warning notification
   * @param {LogPayload} [payload] - Context and metadata
   */
  warn(message: string, payload?: Omit<LogPayload, "message">): void {
    console.warn(this.format("warn", { message, ...payload }));
  }

  /**
   * Records a high-severity error or system failure requiring administrative attention.
   *
   * @param {string} message - Failure synopsis
   * @param {LogPayload} [payload] - Error instance, context and metadata
   */
  error(message: string, payload?: Omit<LogPayload, "message">): void {
    console.error(this.format("error", { message, ...payload }));
  }
}

export const logger = new Logger();
