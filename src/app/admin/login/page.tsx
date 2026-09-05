"use client";

/**
 * @file admin/login/page.tsx
 * @description Admin login route rendering the multi-role login interface.
 * @module app/admin/login
 */

import { AdminLoginForm } from "@/shared/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--green-dark)] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute w-[500px] h-[500px] bg-[var(--green)] rounded-full blur-3xl opacity-30 -top-40 -right-40 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-[var(--gold)] rounded-full blur-3xl opacity-10 -bottom-20 -left-20 pointer-events-none" />

      <AdminLoginForm />
    </div>
  );
}
