/**
 * @file rate-limiter.ts
 * @description In-memory sliding window rate limiter to throttle form submissions per IP address.
 * Protects against mail-bombing, denial of service, and mail server blacklisting.
 * @module infrastructure/security
 */

interface RateLimitRecord {
  timestamps: number[];
}

const cache = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStale(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of cache.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (validTimestamps.length === 0) {
      cache.delete(key);
    } else {
      cache.set(key, { timestamps: validTimestamps });
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Checks and registers an attempt for a key (typically IP + action).
 * @param key Unique identifier (e.g. `register:192.168.1.1`)
 * @param maxRequests Maximum allowed attempts within window (default 5)
 * @param windowMs Time window in milliseconds (default 10 minutes = 600,000ms)
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 10 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  cleanupStale(windowMs);

  const record = cache.get(key) || { timestamps: [] };
  // Keep only timestamps within the active sliding window
  const activeTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (activeTimestamps.length >= maxRequests) {
    const oldest = activeTimestamps[0];
    const resetInSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  // Record this attempt
  activeTimestamps.push(now);
  cache.set(key, { timestamps: activeTimestamps });

  return {
    allowed: true,
    remaining: maxRequests - activeTimestamps.length,
    resetInSeconds: Math.ceil(windowMs / 1000),
  };
}

/**
 * Reset cache helper (used primarily for automated test fixtures)
 */
export function resetRateLimiter(): void {
  cache.clear();
}
