import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rowToSite } from "@/lib/mappers";
import { PublicSiteView } from "./PublicSiteView";
import type { Metadata } from "next";
import type { SiteRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function loadSiteBySlug(slug: string): Promise<SiteRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sites")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return (data ?? null) as SiteRow | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const row = await loadSiteBySlug(slug);
  if (!row) return { title: "Site não encontrado" };
  const site = rowToSite(row);
  const desc = site.company.shortDesc || site.company.slogan || `Página de ${site.company.name}`;
  return {
    title: site.company.name || "Mini site",
    description: desc,
    openGraph: {
      title: site.company.name,
      description: desc,
      images: site.company.coverUrl ? [site.company.coverUrl] : [],
    },
  };
}

export default async function SitePage({ params }: Props) {
  const { slug } = await params;
  const row = await loadSiteBySlug(slug);
  if (!row) notFound();
  const site = rowToSite(row);
  return <PublicSiteView site={site} />;
}