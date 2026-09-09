"use client";

/**
 * @file AuthContext.tsx
 * @description Authentication context providing role-based sessions for Admin, Manager, and Staff.
 * Supports cookie/localStorage persistence, demo role quick-switching, and Supabase Auth integration.
 * @module core/auth
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import type { UserRole } from "@/core/domain/entities/Profile";
import { AuthUser, DEMO_ACCOUNTS } from "./auth-types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password?: string, preferredRole?: UserRole) => Promise<boolean>;
  loginAsDemo: (role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const COOKIE_NAME = "gcc_auth_session";
const STORAGE_KEY = "gcc_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email && parsed.role) {
          setUser(parsed);
        }
      }
    } catch {
      // Safe fallback
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSession = (authUser: AuthUser) => {
    setUser(authUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      // Set session cookie for 7 days
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
        JSON.stringify({ email: authUser.email, role: authUser.role })
      )};path=/;max-age=604800;SameSite=Lax`;
    } catch {
      // Ignore storage errors
    }
  };

  const login = async (
    email: string,
    password?: string,
    preferredRole?: UserRole
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: password || "demo-password",
          role: preferredRole,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed. Please check credentials.");
      }

      const authUser: AuthUser = data.user;
      setUser(authUser);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      } catch {
        // Safe fallback
      }

      return true;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async (role: UserRole) => {
    const demo = DEMO_ACCOUNTS[role];
    await login(demo.email, "demo-password", demo.role);
  };

  const logout = () => {
    // 1. Call server logout endpoint to clear HttpOnly signed cookie
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});

    // 2. Clear client state
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      document.cookie = `${COOKIE_NAME}=;path=/;max-age=0`;
    } catch {
      // Ignore errors
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
