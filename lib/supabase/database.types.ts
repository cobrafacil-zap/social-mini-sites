// Tipos gerados manualmente (espelho da migration supabase/migrations/0001_init.sql).
// Quando rodar `supabase gen types` eles ficam mais ricos; por ora basta para tipar.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SiteStatus = "draft" | "published" | "disabled";
export type SiteTemplate = "restaurante" | "loja" | "servicos" | "profissional";
export type EventTypeName = "view" | "whatsapp" | "instagram" | "comoChegar" | "telefone" | "outro";

export type SiteRow = {
  id: string;
  slug: string;
  status: SiteStatus;
  template: SiteTemplate;
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
  event_type: EventTypeName;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      sites: {
        Row: SiteRow;
        Insert: Partial<Omit<SiteRow, "id" | "created_at" | "updated_at">> & {
          slug: string;
          template: SiteTemplate;
          status?: SiteStatus;
          company?: Json;
          location?: Json;
          hours?: Json;
          gallery?: Json;
          buttons?: Json;
          customization?: Json;
        };
        Update: Partial<SiteRow>;
      };
      events: {
        Row: EventRow;
        Insert: { site_id: string; event_type: EventTypeName; id?: number; created_at?: string };
        Update: Partial<EventRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};