"use client";

/**
 * @file error.tsx
 * @description Global Next.js App Router error boundary.
 * Renders a graceful alpine-branded recovery screen when unexpected exceptions occur,
 * allowing the user to retry the operation or return to safety.
 */

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { logger } from "@/core/logging/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Uncaught exception captured by global boundary", {
      error,
      metadata: { digest: error.digest },
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center p-6 text-[var(--ink)]">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[var(--border)] shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-[var(--gold)] border border-[var(--gold)]/30 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[var(--gold)] text-xs font-bold uppercase tracking-widest block">
            TEMPORARY SYSTEM IRREGULARITY
          </span>
          <h2 className="font-serif text-3xl font-normal text-[var(--ink)]">
            Something unexpected occurred
          </h2>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Our systems encountered an interruption while rendering this section.
            The error has been logged for technical review.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
