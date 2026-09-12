// Tipos gerados manualmente (espelho da migration supabase/migrations/0001_init.sql).
// Quando rodar `supabase gen types` eles ficam mais ricos; por ora basta para tipar.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SiteRow = {
  id: string;
  slug: string;
  status: "draft" | "published" | "disabled";
  template: "restaurante" | "loja" | "servicos" | "profissional";
  company: Json;
  location: Json;
  hours: Json;
  gallery: Json;
  buttons: Json;
  customization: Json;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: number;
  site_id: string;
  event_type: "view" | "whatsapp" | "instagram" | "comoChegar" | "telefone" | "outro";
  created_at: string;
};

// Mantemos o Database deliberadamente permissivo — a inferência do PostgREST
// é sensível demais para JSONB quando a tabela tem formas conflitantes.
// Os tipos fortes vivem em `lib/types.ts` (Site).
export type Database = {
  public: {
    Tables: {
      sites: {
        Row: SiteRow;
        Insert: SiteRow;
        Update: Partial<SiteRow>;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: EventRow;
        Update: Partial<EventRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};