import type { AuditLog } from "../entities/Profile";

export interface IAuditRepository {
  record(action: string, entity: string, entityId?: string, details?: Record<string, unknown>, actorId?: string): Promise<void>;
  listRecent(limit?: number): Promise<AuditLog[]>;
}
