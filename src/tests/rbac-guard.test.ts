/**
 * @file rbac-guard.test.ts
 * @description Unit tests verifying Role-Based Access Control (RBAC) rules,
 * action authorization matrix, and administrative route guards.
 */

import { describe, it, expect } from "vitest";
import { canPerformAction, isRouteAuthorized } from "@/core/auth/rbac";

describe("RBAC Guard & Capabilities Matrix", () => {
  describe("Admin Role Permissions", () => {
    it("should authorize admin across all sensitive operations", () => {
      expect(canPerformAction("admin", "manage:users")).toBe(true);
      expect(canPerformAction("admin", "manage:roles")).toBe(true);
      expect(canPerformAction("admin", "delete:members")).toBe(true);
      expect(canPerformAction("admin", "delete:events")).toBe(true);
      expect(canPerformAction("admin", "read:audit_logs")).toBe(true);
    });

    it("should permit admin access to all routes including /admin/users", () => {
      expect(isRouteAuthorized("/admin/users", "admin")).toBe(true);
      expect(isRouteAuthorized("/admin/audit-logs", "admin")).toBe(true);
      expect(isRouteAuthorized("/admin/settings", "admin")).toBe(true);
      expect(isRouteAuthorized("/admin", "admin")).toBe(true);
    });
  });

  describe("Manager Role Permissions", () => {
    it("should permit operational actions but deny user & role management", () => {
      expect(canPerformAction("manager", "read:members")).toBe(true);
      expect(canPerformAction("manager", "create:members")).toBe(true);
      expect(canPerformAction("manager", "create:events")).toBe(true);
      expect(canPerformAction("manager", "read:inquiries")).toBe(true);

      // Denied actions
      expect(canPerformAction("manager", "manage:users")).toBe(false);
      expect(canPerformAction("manager", "manage:roles")).toBe(false);
      expect(canPerformAction("manager", "delete:members")).toBe(false);
      expect(canPerformAction("manager", "manage:settings")).toBe(false);
    });

    it("should block manager from /admin/users and /admin/settings", () => {
      expect(isRouteAuthorized("/admin/users", "manager")).toBe(false);
      expect(isRouteAuthorized("/admin/settings", "manager")).toBe(false);
      expect(isRouteAuthorized("/admin/events", "manager")).toBe(true);
      expect(isRouteAuthorized("/admin/members", "manager")).toBe(true);
    });
  });

  describe("Staff Role Permissions", () => {
    it("should enforce read-only and inquiry response permissions strictly", () => {
      expect(canPerformAction("staff", "read:registrations")).toBe(true);
      expect(canPerformAction("staff", "read:members")).toBe(true);
      expect(canPerformAction("staff", "respond:inquiries")).toBe(true);

      // Strictly forbidden actions for staff
      expect(canPerformAction("staff", "delete:members")).toBe(false);
      expect(canPerformAction("staff", "create:events")).toBe(false);
      expect(canPerformAction("staff", "delete:events")).toBe(false);
      expect(canPerformAction("staff", "manage:users")).toBe(false);
      expect(canPerformAction("staff", "read:audit_logs")).toBe(false);
    });

    it("should block staff from /admin/users, /admin/audit-logs, and /admin/settings", () => {
      expect(isRouteAuthorized("/admin/users", "staff")).toBe(false);
      expect(isRouteAuthorized("/admin/audit-logs", "staff")).toBe(false);
      expect(isRouteAuthorized("/admin/settings", "staff")).toBe(false);
      expect(isRouteAuthorized("/admin/inquiries", "staff")).toBe(true);
    });
  });

  describe("Unauthenticated / Null Role", () => {
    it("should deny any action when role is null or undefined", () => {
      expect(canPerformAction(null, "read:dashboard")).toBe(false);
      expect(canPerformAction(undefined, "read:members")).toBe(false);
      expect(isRouteAuthorized("/admin", null)).toBe(false);
    });
  });
});
