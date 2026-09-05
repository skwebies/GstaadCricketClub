/**
 * @file auth.test.ts
 * @description Unit tests for role-based access control and demo account integrity.
 */

import { describe, it, expect } from "vitest";
import { canAccessPath, DEMO_ACCOUNTS, ROLE_PERMISSIONS } from "../core/auth/auth-types";

describe("Role-Based Access Control (RBAC) Suite", () => {
  it("should define all three required roles in DEMO_ACCOUNTS", () => {
    expect(DEMO_ACCOUNTS.admin).toBeDefined();
    expect(DEMO_ACCOUNTS.manager).toBeDefined();
    expect(DEMO_ACCOUNTS.staff).toBeDefined();

    expect(DEMO_ACCOUNTS.admin.role).toBe("admin");
    expect(DEMO_ACCOUNTS.manager.role).toBe("manager");
    expect(DEMO_ACCOUNTS.staff.role).toBe("staff");
  });

  describe("Administrator Permissions", () => {
    const adminRoutes = [
      "/admin",
      "/admin/registrations",
      "/admin/members",
      "/admin/events",
      "/admin/inquiries",
      "/admin/audit-logs",
      "/admin/settings",
    ];

    it("admin should have access to all administrative modules", () => {
      adminRoutes.forEach((route) => {
        expect(canAccessPath("admin", route), `Admin should access ${route}`).toBe(true);
      });
    });
  });

  describe("Operations Manager Permissions", () => {
    it("manager should access operational modules", () => {
      expect(canAccessPath("manager", "/admin")).toBe(true);
      expect(canAccessPath("manager", "/admin/registrations")).toBe(true);
      expect(canAccessPath("manager", "/admin/members")).toBe(true);
      expect(canAccessPath("manager", "/admin/events")).toBe(true);
      expect(canAccessPath("manager", "/admin/inquiries")).toBe(true);
    });

    it("manager should NOT access high-governance settings or audit logs", () => {
      expect(canAccessPath("manager", "/admin/audit-logs")).toBe(false);
      expect(canAccessPath("manager", "/admin/settings")).toBe(false);
    });
  });

  describe("Matchday Staff / Volunteer Permissions", () => {
    it("staff should only access registrations roster and dashboard", () => {
      expect(canAccessPath("staff", "/admin")).toBe(true);
      expect(canAccessPath("staff", "/admin/registrations")).toBe(true);
    });

    it("staff should NOT access members, events, inquiries, audit logs, or settings", () => {
      expect(canAccessPath("staff", "/admin/members")).toBe(false);
      expect(canAccessPath("staff", "/admin/events")).toBe(false);
      expect(canAccessPath("staff", "/admin/inquiries")).toBe(false);
      expect(canAccessPath("staff", "/admin/audit-logs")).toBe(false);
      expect(canAccessPath("staff", "/admin/settings")).toBe(false);
    });
  });

  it("should handle sub-paths correctly", () => {
    expect(canAccessPath("admin", "/admin/registrations/12345")).toBe(true);
    expect(canAccessPath("staff", "/admin/registrations/12345")).toBe(true);
    expect(canAccessPath("staff", "/admin/members/new")).toBe(false);
  });
});
