import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { rowToSite } from "@/lib/mappers";
import { StatsView, type StatsEvent } from "@/components/admin/stats/StatsView";
import type { SiteRow, EventRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

export default async function StatsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: row }, { data: events }] = await Promise.all([
    supabase.from("sites").select("*").eq("id", id).single(),
    supabase
      .from("events")
      .select("event_type, created_at")
      .eq("site_id", id)
      .order("created_at", { ascending: false })
      .limit(5000),
  ]);

  if (!row) notFound();
  const site = rowToSite(row as unknown as SiteRow);
  const eventList = (events ?? []) as Pick<EventRow, "event_type" | "created_at">[];

  // Série compacta para o cliente filtrar qualquer período sem nova ida ao banco.
  const packed: StatsEvent[] = eventList.map((e) => [
    new Date(e.created_at).getTime(),
    e.event_type,
  ]);

  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "smdigtal.com").toLowerCase();

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 py-6 sm:px-6 sm:py-8">
      <Link href={`/admin/client/${id}`} className="btn-ghost btn-sm -ml-2 mb-4">
        <ArrowLeft size={14} /> Voltar ao cliente
      </Link>

      <header className="mb-5">
        <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-ink sm:text-[23px]">
          Estatísticas
        </h1>
        <p className="mt-1 truncate text-[13px] text-muted">
          {site.company.name || "(sem nome)"} · {site.slug}.{root}
        </p>
      </header>

      <StatsView events={packed} now={Date.now()} />
    </div>
  );
}
