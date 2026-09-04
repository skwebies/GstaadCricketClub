import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../supabase/database.types";
import type { IRegistrationRepository } from "@/core/domain/repositories/IRegistrationRepository";
import type { EventRegistration, CreateRegistrationInput } from "@/core/domain/entities/Registration";

export class SupabaseRegistrationRepository implements IRegistrationRepository {
  constructor(private client: SupabaseClient<Database>) {}

  private mapRowToEntity(row: Database["public"]["Tables"]["event_registrations"]["Row"]): EventRegistration {
    return {
      id: row.id,
      eventId: row.event_id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      registrationType: row.registration_type,
      dietaryRequirements: row.dietary_requirements,
      emergencyContact: row.emergency_contact,
      createdAt: row.created_at,
    };
  }

  async create(data: CreateRegistrationInput): Promise<EventRegistration> {
    const { data: row, error } = await this.client
      .from("event_registrations")
      .insert({
        event_id: data.eventId,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        registration_type: data.registrationType,
        dietary_requirements: data.dietaryRequirements || null,
        emergency_contact: data.emergencyContact,
      })
      .select()
      .single();

    if (error || !row) {
      throw new Error(`Failed to create registration: ${error?.message}`);
    }

    return this.mapRowToEntity(row);
  }

  async findByEmailAndEvent(email: string, eventId: string): Promise<EventRegistration | null> {
    const { data: row, error } = await this.client
      .from("event_registrations")
      .select()
      .eq("email", email)
      .eq("event_id", eventId)
      .maybeSingle();

    if (error || !row) return null;
    return this.mapRowToEntity(row);
  }

  async listByEvent(eventId: string): Promise<EventRegistration[]> {
    const { data: rows, error } = await this.client
      .from("event_registrations")
      .select()
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error || !rows) return [];
    return rows.map(this.mapRowToEntity);
  }

  async listAll(): Promise<EventRegistration[]> {
    const { data: rows, error } = await this.client
      .from("event_registrations")
      .select()
      .order("created_at", { ascending: false });

    if (error || !rows) return [];
    return rows.map(this.mapRowToEntity);
  }

  async countByEvent(eventId: string): Promise<number> {
    const { count, error } = await this.client
      .from("event_registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId);

    if (error) return 0;
    return count ?? 0;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client
      .from("event_registrations")
      .delete()
      .eq("id", id);

    return !error;
  }
}
