/**
 * @file auth-types.ts
 * @description Types and demo accounts for role-based administrative control.
 * Supports Admin, Manager, and Staff roles with explicit route permissions.
 * @module core/auth
 */

import { UserRole } from "@/core/domain/entities/Profile";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  title: string;
}

export interface DemoAccount {
  email: string;
  role: UserRole;
  fullName: string;
  title: string;
  description: string;
}

export const DEMO_ACCOUNTS: Record<UserRole, DemoAccount> = {
  admin: {
    email: "admin@gstaadcricketclub.ch",
    role: "admin",
    fullName: "Sathya Narayanan",
    title: "Club President & Administrator",
    description: "Full governance, finance, member directory, settings and security audit logs",
  },
  manager: {
    email: "manager@gstaadcricketclub.ch",
    role: "manager",
    fullName: "Club Operations Desk",
    title: "Operations & Fixtures Manager",
    description: "Event scheduling, match logistics, membership applications and messages inbox",
  },
  staff: {
    email: "staff@gstaadcricketclub.ch",
    role: "staff",
    fullName: "Festival Volunteer Team",
    title: "Matchday Staff / Volunteer",
    description: "Festival check-in desk, attendee roster, and registrations review",
  },
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    "/admin",
    "/admin/registrations",
    "/admin/members",
    "/admin/events",
    "/admin/inquiries",
    "/admin/audit-logs",
    "/admin/settings",
  ],
  manager: [
    "/admin",
    "/admin/registrations",
    "/admin/members",
    "/admin/events",
    "/admin/inquiries",
  ],
  staff: [
    "/admin",
    "/admin/registrations",
  ],
};

export function canAccessPath(role: UserRole, path: string): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  const cleanPath = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

  return allowed.some((allowedPath) => {
    if (cleanPath === allowedPath) return true;
    // Do not let base "/admin" match arbitrary sub-routes like "/admin/audit-logs"
    if (allowedPath === "/admin") return false;
    return cleanPath.startsWith(`${allowedPath}/`);
  });
}
