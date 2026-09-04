/**
 * @file rbac.ts
 * @description Role-Based Access Control (RBAC) permission domain model for Gstaad Cricket Club.
 * Defines hierarchical user roles, granular permission capabilities, route guards, and
 * visual styling tokens for administrative user indicators.
 * @module core/auth
 */

export type UserRole = "admin" | "manager" | "staff";

/**
 * Granular capability permissions governing access to administrative resources.
 */
export type PermissionAction =
  | "read:dashboard"
  | "read:registrations"
  | "delete:registrations"
  | "export:registrations"
  | "read:members"
  | "create:members"
  | "update:members"
  | "delete:members"
  | "read:events"
  | "create:events"
  | "update:events"
  | "delete:events"
  | "read:inquiries"
  | "respond:inquiries"
  | "delete:inquiries"
  | "read:audit_logs"
  | "manage:users"
  | "manage:roles"
  | "manage:settings";

/**
 * Static permission matrix assigning actions to authorized roles.
 */
const ROLE_PERMISSIONS: Record<UserRole, readonly PermissionAction[]> = {
  admin: [
    "read:dashboard",
    "read:registrations",
    "delete:registrations",
    "export:registrations",
    "read:members",
    "create:members",
    "update:members",
    "delete:members",
    "read:events",
    "create:events",
    "update:events",
    "delete:events",
    "read:inquiries",
    "respond:inquiries",
    "delete:inquiries",
    "read:audit_logs",
    "manage:users",
    "manage:roles",
    "manage:settings",
  ],
  manager: [
    "read:dashboard",
    "read:registrations",
    "export:registrations",
    "read:members",
    "create:members",
    "update:members",
    "read:events",
    "create:events",
    "update:events",
    "read:inquiries",
    "respond:inquiries",
    "read:audit_logs",
  ],
  staff: [
    "read:dashboard",
    "read:registrations",
    "export:registrations",
    "read:members",
    "read:events",
    "read:inquiries",
    "respond:inquiries",
  ],
} as const;

/**
 * Evaluates whether a specified user role possesses permission to execute a given action.
 *
 * @param {UserRole | null | undefined} role - The authenticated user's role
 * @param {PermissionAction} action - The targeted capability being asserted
 * @returns {boolean} True if the role is authorized; false otherwise
 *
 * @example
 * ```typescript
 * if (!canPerformAction(user.role, "delete:members")) {
 *   throw new Error("Unauthorized: Staff members cannot delete club records.");
 * }
 * ```
 */
export function canPerformAction(
  role: UserRole | null | undefined,
  action: PermissionAction
): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(action) : false;
}

/**
 * Route protection rules specifying minimum role authorization per pathname prefix.
 */
export const ROUTE_ACCESS_MAP: Record<string, UserRole[]> = {
  "/admin/users": ["admin"],
  "/admin/audit-logs": ["admin", "manager"],
  "/admin/settings": ["admin"],
  "/admin/events": ["admin", "manager", "staff"],
  "/admin/members": ["admin", "manager", "staff"],
  "/admin/registrations": ["admin", "manager", "staff"],
  "/admin/inquiries": ["admin", "manager", "staff"],
  "/admin": ["admin", "manager", "staff"],
};

/**
 * Checks whether a role is authorized to access a given URL path.
 *
 * @param {string} pathname - Target admin path
 * @param {UserRole | null | undefined} role - Authenticated role
 * @returns {boolean} True if permitted to navigate to the route
 */
export function isRouteAuthorized(
  pathname: string,
  role: UserRole | null | undefined
): boolean {
  if (!role) return false;

  for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_ACCESS_MAP)) {
    if (pathname === routePrefix || pathname.startsWith(`${routePrefix}/`)) {
      return allowedRoles.includes(role);
    }
  }

  // Default to permitted for unrecognized sub-paths if general role exists
  return true;
}

/**
 * Visual styling tokens for role badges throughout the user interface.
 */
export const ROLE_BADGE_STYLES: Record<
  UserRole,
  { label: string; bg: string; text: string; border: string }
> = {
  admin: {
    label: "Admin",
    bg: "bg-amber-100",
    text: "text-amber-900",
    border: "border-amber-300",
  },
  manager: {
    label: "Manager",
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    border: "border-emerald-300",
  },
  staff: {
    label: "Staff",
    bg: "bg-blue-100",
    text: "text-blue-900",
    border: "border-blue-300",
  },
};
