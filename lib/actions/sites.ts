"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify, isValidSlug } from "@/lib/slugify";
import { TEMPLATES } from "@/lib/templates";
import type { Site } from "@/lib/types";
import { DEFAULT_COMPANY, DEFAULT_CUSTOMIZATION, DEFAULT_HOURS, DEFAULT_LOCATION } from "@/lib/types";
import type { SiteRow } from "@/lib/supabase/database.types";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return supabase;
}

export async function createSite(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const template = String(formData.get("template") ?? "") as keyof typeof TEMPLATES;
  if (!TEMPLATES[template]) redirect("/admin/new");

  const id = crypto.randomUUID();
  const tmp = TEMPLATES[template];
  const slug = slugify(`novo-${tmp.label.toLowerCase()}`) || `site-${id.slice(0, 4)}`;

  const { error } = await supabase.from("sites").insert({
    id,
    slug,
    template,
    status: "draft",
    company: { ...DEFAULT_COMPANY, category: tmp.defaultCategory },
    location: DEFAULT_LOCATION,
    hours: DEFAULT_HOURS,
    gallery: [],
    buttons: tmp.defaultButtons.map((b, i) => ({ ...b, id: `btn_${i}`, order: i })),
    customization: DEFAULT_CUSTOMIZATION,
  } satisfies Partial<SiteRow> as never);
  if (error) {
    console.error("createSite error", error);
    redirect("/admin");
  }
  redirect(`/admin/edit/${id}`);
}

export async function updateSite(id: string, patch: Partial<Site>): Promise<{ error?: string }> {
  const supabase = await requireAdmin();
  // Campos serializáveis que vão para JSONB
  const writable: Partial<SiteRow> = {};
  if (patch.slug !== undefined) {
    if (!isValidSlug(patch.slug)) return { error: "Slug inválido. Use apenas letras minúsculas, números e hífens." };
    writable.slug = patch.slug;
  }
  if ((patch as Record<string, unknown>).slugTouched !== undefined) {
    (writable as Record<string, unknown>).slugTouched = (patch as Record<string, unknown>).slugTouched;
  }
  if (patch.status !== undefined) writable.status = patch.status;
  if (patch.template !== undefined) writable.template = patch.template;
  if (patch.company !== undefined) writable.company = patch.company as unknown as SiteRow["company"];
  if (patch.location !== undefined) writable.location = patch.location as unknown as SiteRow["location"];
  if (patch.hours !== undefined) writable.hours = patch.hours as unknown as SiteRow["hours"];
  if (patch.gallery !== undefined) writable.gallery = patch.gallery as unknown as SiteRow["gallery"];
  if (patch.buttons !== undefined) writable.buttons = patch.buttons as unknown as SiteRow["buttons"];
  if (patch.customization !== undefined) writable.customization = patch.customization as unknown as SiteRow["customization"];

  const { error } = await supabase.from("sites").update(writable as never).eq("id", id);
  if (error) {
    if (error.code === "23505") return { error: "Esse slug já está em uso por outro site." };
    return { error: error.message };
  }
  revalidatePath(`/admin/edit/${id}`);
  if (patch.slug) revalidatePath(`/sites/${patch.slug}`);
  return {};
}

export async function deleteSite(id: string): Promise<void> {
  const supabase = await requireAdmin();
  // best-effort: remove objetos do storage antes de deletar o site (cascade)
  try {
    const { data: objects } = await supabase.storage.from("gallery").list("", { limit: 1000 });
    if (objects?.length) {
      const paths = objects.map((o) => o.name);
      await supabase.storage.from("gallery").remove(paths);
    }
  } catch (e) {
    console.warn("storage cleanup falhou", e);
  }
  await supabase.from("sites").delete().eq("id", id);
  revalidatePath("/admin");
  redirect("/admin");
}