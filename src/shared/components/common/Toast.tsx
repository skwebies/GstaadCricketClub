"use client";

/**
 * @file Toast.tsx
 * @description Swiss Alpine luxury toast notification system.
 * Provides accessible, floating notifications for registration, contact, and system actions
 * with Alpine Forest Green, Swiss Gold, and Crimson aesthetics.
 * @module shared/components/common
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

export interface ToastOptions {
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (options: ToastOptions) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, description, duration = 4500 }: ToastOptions): string => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastItem = { id, type, title, description, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function Toaster({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 max-w-sm sm:max-w-md w-[calc(100vw-2.5rem)] pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  // Alpine luxury styling configuration
  const cardStyles = isSuccess
    ? "bg-[#0A1C15] text-[#FDFCF7] border-l-4 border-[#C5A059] shadow-[0_16px_40px_rgba(10,28,21,0.4)]"
    : isError
    ? "bg-[#250B0E] text-[#FFF5F5] border-l-4 border-[#E53E3E] shadow-[0_16px_40px_rgba(37,11,14,0.4)]"
    : "bg-[#0F2238] text-[#F0F7FF] border-l-4 border-[#4FD1C5] shadow-[0_16px_40px_rgba(15,34,56,0.4)]";

  return (
    <div
      role="status"
      className={`pointer-events-auto p-4 transition-all duration-300 transform translate-y-0 opacity-100 border border-white/10 ${cardStyles}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="shrink-0 mt-0.5">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />}
          {isError && <AlertCircle className="w-5 h-5 text-[#FC8181]" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-[#4FD1C5]" />}
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <h4 className="font-serif text-sm font-semibold tracking-wide leading-snug">
            {toast.title}
          </h4>
          {toast.description && (
            <p className="mt-1 text-xs opacity-85 leading-relaxed font-sans font-light">
              {toast.description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="shrink-0 text-white/50 hover:text-white transition-colors p-1 -mr-1 -mt-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
