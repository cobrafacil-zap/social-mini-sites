import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { rowToSite } from "@/lib/mappers";
import { Editor } from "@/components/admin/Editor";
import type { SiteRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("sites").select("*").eq("id", id).single();
  if (!data) notFound();
  const site = rowToSite(data as unknown as SiteRow);
  return <Editor initial={site} />;
}