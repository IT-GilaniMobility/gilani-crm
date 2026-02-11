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
      profiles: {
        Row: {
          id: string;
          role: string | null;
          manager_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          role?: string | null;
          manager_id?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          role?: string | null;
          manager_id?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          created_at: string | null;
          inquiry_date: string | null;
          client_name: string | null;
          company_name: string | null;
          phone: string | null;
          email: string | null;
          assigned_to: string | null;
          source: string | null;
          channel: string | null;
          product_category: string | null;
          enquiring_about: string | null;
          status: string | null;
          latest_update: string | null;
          notes: string | null;
          lost_reason: string | null;
          doc_no: string | null;
          amount: number | null;
          payment_done: boolean | null;
          last_status_change_at: string | null;
          deadline_at: string | null;
          auto_lost: boolean | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          inquiry_date?: string | null;
          client_name?: string | null;
          company_name?: string | null;
          phone?: string | null;
          email?: string | null;
          assigned_to?: string | null;
          source?: string | null;
          channel?: string | null;
          product_category?: string | null;
          enquiring_about?: string | null;
          status?: string | null;
          latest_update?: string | null;
          notes?: string | null;
          lost_reason?: string | null;
          doc_no?: string | null;
          amount?: number | null;
          payment_done?: boolean | null;
          last_status_change_at?: string | null;
          deadline_at?: string | null;
          auto_lost?: boolean | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          inquiry_date?: string | null;
          client_name?: string | null;
          company_name?: string | null;
          phone?: string | null;
          email?: string | null;
          assigned_to?: string | null;
          source?: string | null;
          channel?: string | null;
          product_category?: string | null;
          enquiring_about?: string | null;
          status?: string | null;
          latest_update?: string | null;
          notes?: string | null;
          lost_reason?: string | null;
          doc_no?: string | null;
          amount?: number | null;
          payment_done?: boolean | null;
          last_status_change_at?: string | null;
          deadline_at?: string | null;
          auto_lost?: boolean | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ProfileRole = "sales" | "manager" | "admin";
