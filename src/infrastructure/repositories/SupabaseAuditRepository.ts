import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../supabase/database.types";
import type { IAuditRepository } from "@/core/domain/repositories/IAuditRepository";
import type { AuditLog } from "@/core/domain/entities/Profile";

export class SupabaseAuditRepository implements IAuditRepository {
  constructor(private client: SupabaseClient<Database>) {}

  async record(
    action: string,
    entity: string,
    entityId?: string,
    details?: Record<string, unknown>,
    actorId?: string
  ): Promise<void> {
    await this.client.from("audit_logs").insert({
      action,
      entity,
      entity_id: entityId || null,
      details: details ? (details as any) : null,
      actor_id: actorId || null,
    });
  }

  async listRecent(limit: number = 50): Promise<AuditLog[]> {
    const { data: rows, error } = await this.client
      .from("audit_logs")
      .select()
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !rows) return [];

    return rows.map((row) => ({
      id: row.id,
      actorId: row.actor_id,
      action: row.action,
      entity: row.entity,
      entityId: row.entity_id,
      details: row.details as Record<string, unknown> | null,
      createdAt: row.created_at,
    }));
  }
}
