export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          details: Json | null;
          entity: string;
          entity_id: string | null;
          id: string;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          details?: Json | null;
          entity: string;
          entity_id?: string | null;
          id?: string;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          details?: Json | null;
          entity?: string;
          entity_id?: string | null;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          ip_hash: string | null;
          message: string;
          name: string;
          status: Database["public"]["Enums"]["inquiry_status"];
          subject: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          ip_hash?: string | null;
          message: string;
          name: string;
          status?: Database["public"]["Enums"]["inquiry_status"];
          subject: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          ip_hash?: string | null;
          message?: string;
          name?: string;
          status?: Database["public"]["Enums"]["inquiry_status"];
          subject?: string;
        };
        Relationships: [];
      };
      event_registrations: {
        Row: {
          created_at: string;
          dietary_requirements: string | null;
          email: string;
          emergency_contact: string;
          event_id: string;
          full_name: string;
          id: string;
          phone: string;
          registration_type: Database["public"]["Enums"]["registration_type"];
        };
        Insert: {
          created_at?: string;
          dietary_requirements?: string | null;
          email: string;
          emergency_contact: string;
          event_id: string;
          full_name: string;
          id?: string;
          phone: string;
          registration_type?: Database["public"]["Enums"]["registration_type"];
        };
        Update: {
          created_at?: string;
          dietary_requirements?: string | null;
          email?: string;
          emergency_contact?: string;
          event_id?: string;
          full_name?: string;
          id?: string;
          phone?: string;
          registration_type?: Database["public"]["Enums"]["registration_type"];
        };
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          created_at: string;
          description: string;
          end_date: string;
          id: string;
          is_active: boolean;
          location: string;
          max_participants: number;
          slug: string;
          start_date: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          end_date: string;
          id?: string;
          is_active?: boolean;
          location?: string;
          max_participants?: number;
          slug: string;
          start_date: string;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          end_date?: string;
          id?: string;
          is_active?: boolean;
          location?: string;
          max_participants?: number;
          slug?: string;
          start_date?: string;
          title?: string;
        };
        Relationships: [];
      };
      members: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          handicap_or_experience: string | null;
          id: string;
          notes: string | null;
          phone: string;
          status: Database["public"]["Enums"]["member_status"];
          tier: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name: string;
          handicap_or_experience?: string | null;
          id?: string;
          notes?: string | null;
          phone: string;
          status?: Database["public"]["Enums"]["member_status"];
          tier: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          handicap_or_experience?: string | null;
          id?: string;
          notes?: string | null;
          phone?: string;
          status?: Database["public"]["Enums"]["member_status"];
          tier?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name: string;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_my_role: {
        Args: never;
        Returns: Database["public"]["Enums"]["user_role"];
      };
    };
    Enums: {
      inquiry_status: "unread" | "read" | "responded";
      member_status: "active" | "pending" | "inactive";
      registration_type: "playing_member" | "spectator" | "vip_patron";
      user_role: "admin" | "manager" | "staff";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
