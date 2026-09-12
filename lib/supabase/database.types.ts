// Tipos gerados manualmente (espelho da migration supabase/migrations/0001_init.sql).
// Quando rodar `supabase gen types` eles ficam mais ricos; por ora basta para tipar.

export type Json = string | number | boolean | null | { [k: string]: Json | undefined } | Json[];

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

export type Database = {
  public: {
    Tables: {
      sites: { Row: SiteRow; Insert: Omit<SiteRow, "id" | "created_at" | "updated_at"> & Partial<Pick<SiteRow, "id" | "created_at" | "updated_at">>; Update: Partial<SiteRow> };
      events: { Row: EventRow; Insert: Omit<EventRow, "id" | "created_at"> & Partial<Pick<EventRow, "id" | "created_at">>; Update: Partial<EventRow> };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};