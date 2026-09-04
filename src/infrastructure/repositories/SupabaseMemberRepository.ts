import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../supabase/database.types";
import type { IMemberRepository } from "@/core/domain/repositories/IMemberRepository";
import type { Member, CreateMemberInput, MemberStatus, MemberTier } from "@/core/domain/entities/Member";

export class SupabaseMemberRepository implements IMemberRepository {
  constructor(private client: SupabaseClient<Database>) {}

  private mapRowToEntity(row: Database["public"]["Tables"]["members"]["Row"]): Member {
    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      handicapOrExperience: row.handicap_or_experience,
      tier: row.tier as MemberTier,
      status: row.status,
      notes: row.notes,
      createdAt: row.created_at,
    };
  }

  async create(data: CreateMemberInput): Promise<Member> {
    const { data: row, error } = await this.client
      .from("members")
      .insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        handicap_or_experience: data.handicapOrExperience || null,
        tier: data.tier,
        status: data.status ?? "pending",
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error || !row) {
      throw new Error(`Failed to create member: ${error?.message}`);
    }

    return this.mapRowToEntity(row);
  }

  async findById(id: string): Promise<Member | null> {
    const { data: row, error } = await this.client
      .from("members")
      .select()
      .eq("id", id)
      .maybeSingle();

    if (error || !row) return null;
    return this.mapRowToEntity(row);
  }

  async findByEmail(email: string): Promise<Member | null> {
    const { data: row, error } = await this.client
      .from("members")
      .select()
      .eq("email", email)
      .maybeSingle();

    if (error || !row) return null;
    return this.mapRowToEntity(row);
  }

  async list(filters?: { status?: MemberStatus; tier?: MemberTier; search?: string }): Promise<Member[]> {
    let query = this.client.from("members").select().order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.tier) {
      query = query.eq("tier", filters.tier);
    }

    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    const { data: rows, error } = await query;
    if (error || !rows) return [];
    return rows.map(this.mapRowToEntity);
  }

  async updateStatus(id: string, status: MemberStatus): Promise<Member> {
    const { data: row, error } = await this.client
      .from("members")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error || !row) {
      throw new Error(`Failed to update member status: ${error?.message}`);
    }

    return this.mapRowToEntity(row);
  }

  async count(): Promise<number> {
    const { count, error } = await this.client
      .from("members")
      .select("*", { count: "exact", head: true });

    if (error) return 0;
    return count ?? 0;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client
      .from("members")
      .delete()
      .eq("id", id);

    return !error;
  }
}
