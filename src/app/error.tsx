"use client";

/**
 * @file error.tsx
 * @description Global application error boundary styled with Alpine luxury branding.
 * Provides instant user recovery via reset() and friendly error diagnostics.
 * @module app
 */

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely
    console.error("GCC Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 md:p-12 shadow-2xl border-t-4 border-[var(--gold)] space-y-6">
        <div className="relative w-16 h-16 mx-auto">
          <Image
            src="/gstaad-cricket-club-crest.png"
            alt="Gstaad Cricket Club Crest"
            fill
            className="object-contain"
          />
        </div>

        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <span className="text-[0.7rem] uppercase font-extrabold tracking-[0.2em] text-[var(--gold)] block mb-1">
            GSTAAD CRICKET CLUB
          </span>
          <h1 className="font-serif text-3xl text-[var(--ink)] font-normal">
            Something went wrong
          </h1>
          <p className="text-sm text-[#5c6d66] mt-3 leading-relaxed">
            An unexpected situation occurred while loading this page. Our team has been notified.
          </p>
        </div>

        {error.digest && (
          <div className="bg-gray-50 p-2.5 rounded text-[0.7rem] font-mono text-gray-500">
            Error ID: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] px-6 py-3 font-extrabold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto border border-[#c9ccc8] hover:border-[var(--gold)] text-[var(--ink)] px-6 py-3 font-extrabold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
