/**
 * @file anti-spam.ts
 * @description Anti-spam protection and header sanitization for all web form submissions.
 * Prevents automated bot flooding via invisible honeypot traps and CRLF injection.
 * @module infrastructure/security
 */

/**
 * Strips carriage returns and line feeds to protect against SMTP header injection attacks (CRLF injection).
 */
export function sanitizeHeader(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .replace(/[\r\n\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 250);
}

/**
 * Checks if the invisible honeypot field has been filled by an automated spam bot.
 * Legitimate users never see or fill this field.
 */
export function isHoneypotTriggered(botField: unknown): boolean {
  if (typeof botField === "string") {
    return botField.trim().length > 0;
  }
  return Boolean(botField);
}

/**
 * Extracts the real client IP address from proxy headers.
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0].trim();
    if (first) return first;
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  return "127.0.0.1";
}
