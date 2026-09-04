"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/infrastructure/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // If credentials are fresh in local dev, allow quick bypass or display clear error
        throw new Error(authError.message);
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--green-dark)] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute w-[500px] h-[500px] bg-[var(--green)] rounded-full blur-3xl opacity-30 -top-40 -right-40" />

      <div className="max-w-md w-full bg-white p-8 md:p-12 shadow-2xl relative z-10 border-t-4 border-[var(--gold)]">
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <Image
              src="/gstaad-cricket-club-crest.png"
              alt="Gstaad Cricket Club Crest"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="font-serif text-3xl text-[var(--ink)] font-normal">
            Club Admin Portal
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#7c857f] font-bold mt-1">
            Gstaad Cricket Club
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-[var(--red)] text-[var(--red)] text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
            Admin Email
            <div className="relative mt-2">
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                required
                type="email"
                placeholder="admin@gstaadcricketclub.ch"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[46px] pl-11 pr-4 text-sm font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
            </div>
          </label>

          <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
            Password
            <div className="relative mt-2">
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                required
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[46px] pl-11 pr-4 text-sm font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] py-3.5 font-extrabold uppercase tracking-wider text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-50 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Enter Control Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          <Link href="/" className="hover:text-[var(--gold)] underline">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
