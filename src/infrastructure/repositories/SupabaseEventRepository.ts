import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../supabase/database.types";
import type { IEventRepository } from "@/core/domain/repositories/IEventRepository";
import type { ClubEvent, CreateEventInput } from "@/core/domain/entities/Event";

export class SupabaseEventRepository implements IEventRepository {
  constructor(private client: SupabaseClient<Database>) {}

  private mapRowToEntity(row: Database["public"]["Tables"]["events"]["Row"]): ClubEvent {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      location: row.location,
      startDate: row.start_date,
      endDate: row.end_date,
      maxParticipants: row.max_participants,
      isActive: row.is_active,
      createdAt: row.created_at,
    };
  }

  async create(data: CreateEventInput): Promise<ClubEvent> {
    const { data: row, error } = await this.client
      .from("events")
      .insert({
        title: data.title,
        slug: data.slug,
        description: data.description,
        location: data.location,
        start_date: data.startDate,
        end_date: data.endDate,
        max_participants: data.maxParticipants,
        is_active: data.isActive ?? true,
      })
      .select()
      .single();

    if (error || !row) {
      throw new Error(`Failed to create event: ${error?.message}`);
    }

    return this.mapRowToEntity(row);
  }

  async findBySlug(slug: string): Promise<ClubEvent | null> {
    const { data: row, error } = await this.client
      .from("events")
      .select()
      .eq("slug", slug)
      .maybeSingle();

    if (error || !row) return null;
    return this.mapRowToEntity(row);
  }

  async findById(id: string): Promise<ClubEvent | null> {
    const { data: row, error } = await this.client
      .from("events")
      .select()
      .eq("id", id)
      .maybeSingle();

    if (error || !row) return null;
    return this.mapRowToEntity(row);
  }

  async listActive(): Promise<ClubEvent[]> {
    const { data: rows, error } = await this.client
      .from("events")
      .select()
      .eq("is_active", true)
      .order("start_date", { ascending: true });

    if (error || !rows) return [];
    return rows.map(this.mapRowToEntity);
  }

  async listAll(): Promise<ClubEvent[]> {
    const { data: rows, error } = await this.client
      .from("events")
      .select()
      .order("start_date", { ascending: false });

    if (error || !rows) return [];
    return rows.map(this.mapRowToEntity);
  }

  async update(id: string, updates: Partial<CreateEventInput>): Promise<ClubEvent> {
    const updatePayload: Database["public"]["Tables"]["events"]["Update"] = {};
    if (updates.title) updatePayload.title = updates.title;
    if (updates.slug) updatePayload.slug = updates.slug;
    if (updates.description) updatePayload.description = updates.description;
    if (updates.location) updatePayload.location = updates.location;
    if (updates.startDate) updatePayload.start_date = updates.startDate;
    if (updates.endDate) updatePayload.end_date = updates.endDate;
    if (updates.maxParticipants) updatePayload.max_participants = updates.maxParticipants;
    if (updates.isActive !== undefined) updatePayload.is_active = updates.isActive;

    const { data: row, error } = await this.client
      .from("events")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error || !row) {
      throw new Error(`Failed to update event: ${error?.message}`);
    }

    return this.mapRowToEntity(row);
  }

  async toggleActive(id: string, isActive: boolean): Promise<ClubEvent> {
    return this.update(id, { isActive });
  }
}
