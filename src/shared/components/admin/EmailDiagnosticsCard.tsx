"use client";

import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

export function EmailDiagnosticsCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    method?: string;
    messageId?: string;
    recipient?: string;
    error?: string;
    timestamp?: string;
  } | null>(null);

  const handleTestEmail = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
      });
      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : "Network error triggering test email",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <Mail className="w-5 h-5 text-[var(--gold)]" />
          <h2 className="font-serif text-xl font-normal text-[var(--ink)]">
            Mail Delivery &amp; Postfix Engine
          </h2>
        </div>
        <span className="text-[0.65rem] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Self-Healing Pipeline
        </span>
      </div>

      <div className="space-y-3 text-xs text-gray-700">
        <div className="flex justify-between py-2 border-b border-gray-50">
          <span className="font-bold uppercase tracking-wider text-gray-400">Target Inbox</span>
          <span className="font-semibold text-gray-900 font-mono">info@gstaadcricketclub.ch</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-50">
          <span className="font-bold uppercase tracking-wider text-gray-400">Primary Delivery</span>
          <span className="text-gray-900">System MTA (Postfix / sendmail)</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-50">
          <span className="font-bold uppercase tracking-wider text-gray-400">Loopback Fallback</span>
          <span className="font-mono text-gray-900">127.0.0.1:25 (Postfix trusted)</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-50">
          <span className="font-bold uppercase tracking-wider text-gray-400">Remote SMTPS</span>
          <span className="font-mono text-gray-900">Port 465 SSL (Plesk Postfix)</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="font-bold uppercase tracking-wider text-gray-400">Template Brand</span>
          <span className="font-semibold text-emerald-700">Swiss Luxury Crest Layout (HTML + Text)</span>
        </div>
      </div>

      {result && (
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
            result.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          {result.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <div className="font-bold">
              {result.success
                ? `Diagnostic email delivered successfully via ${result.method || "system MTA"}`
                : "Failed to dispatch diagnostic email"}
            </div>
            {result.recipient && (
              <div>
                Target: <span className="font-mono">{result.recipient}</span>
              </div>
            )}
            {result.messageId && (
              <div className="font-mono text-[10px] text-gray-500">ID: {result.messageId}</div>
            )}
            {result.error && <div className="text-rose-700 font-mono text-[11px]">{result.error}</div>}
          </div>
        </div>
      )}

      <div className="pt-2">
        <button
          type="button"
          onClick={handleTestEmail}
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--green-dark)] hover:bg-[var(--green)] text-white text-xs uppercase font-extrabold tracking-wider px-5 py-2.5 rounded-md transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Dispatching Diagnostic Email...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Send Diagnostic Email to info@gstaadcricketclub.ch</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
