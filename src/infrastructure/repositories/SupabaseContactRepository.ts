import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../supabase/database.types";
import type { IContactRepository } from "@/core/domain/repositories/IContactRepository";
import type { ContactMessage, CreateContactMessageInput, InquiryStatus } from "@/core/domain/entities/ContactMessage";

export class SupabaseContactRepository implements IContactRepository {
  constructor(private client: SupabaseClient<Database>) {}

  private mapRowToEntity(row: Database["public"]["Tables"]["contact_messages"]["Row"]): ContactMessage {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      status: row.status,
      ipHash: row.ip_hash,
      createdAt: row.created_at,
    };
  }

  async create(data: CreateContactMessageInput): Promise<ContactMessage> {
    const { data: row, error } = await this.client
      .from("contact_messages")
      .insert({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        ip_hash: data.ipHash || null,
        status: "unread",
      })
      .select()
      .single();

    if (error || !row) {
      throw new Error(`Failed to save contact message: ${error?.message}`);
    }

    return this.mapRowToEntity(row);
  }

  async list(status?: InquiryStatus): Promise<ContactMessage[]> {
    let query = this.client.from("contact_messages").select().order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: rows, error } = await query;
    if (error || !rows) return [];
    return rows.map(this.mapRowToEntity);
  }

  async updateStatus(id: string, status: InquiryStatus): Promise<ContactMessage> {
    const { data: row, error } = await this.client
      .from("contact_messages")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error || !row) {
      throw new Error(`Failed to update inquiry status: ${error?.message}`);
    }

    return this.mapRowToEntity(row);
  }

  async countUnread(): Promise<number> {
    const { count, error } = await this.client
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "unread");

    if (error) return 0;
    return count ?? 0;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client
      .from("contact_messages")
      .delete()
      .eq("id", id);

    return !error;
  }
}
