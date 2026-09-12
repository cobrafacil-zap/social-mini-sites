import type { SiteRow } from "./supabase/database.types";
import type { Site } from "./types";
import { DEFAULT_COMPANY, DEFAULT_CUSTOMIZATION, DEFAULT_HOURS, DEFAULT_LOCATION } from "./types";
import type { Company, Customization, GalleryItem, Hours, Location } from "./types";

function pick<T>(v: unknown, fallback: T): T {
  return v && typeof v === "object" ? (v as T) : fallback;
}

export function rowToSite(row: SiteRow): Site {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    template: row.template,
    company: { ...DEFAULT_COMPANY, ...pick<Partial<Company>>(row.company, {}) },
    location: { ...DEFAULT_LOCATION, ...pick<Partial<Location>>(row.location, {}) },
    hours: { ...DEFAULT_HOURS, ...pick<Partial<Hours>>(row.hours, {}) } as Hours,
    gallery: (Array.isArray(row.gallery) ? row.gallery : []) as GalleryItem[],
    buttons: Array.isArray(row.buttons) ? (row.buttons as Site["buttons"]) : [],
    customization: { ...DEFAULT_CUSTOMIZATION, ...pick<Partial<Customization>>(row.customization, {}) },
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  };
}