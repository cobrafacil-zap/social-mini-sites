import Link from "next/link";
import { ArrowLeft, Eye, MessageCircle, Instagram, MapPin, Phone, MousePointerClick, Info, type LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { rowToSite } from "@/lib/mappers";
import type { EventType } from "@/lib/types";
import type { SiteRow, EventRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

const METRICS: { key: EventType; label: string; Icon: LucideIcon }[] = [
  { key: "view", label: "Visualizações", Icon: Eye },
  { key: "whatsapp", label: "Cliques no WhatsApp", Icon: MessageCircle },
  { key: "instagram", label: "Cliques no Instagram", Icon: Instagram },
  { key: "comoChegar", label: "Cliques em Como chegar", Icon: MapPin },
  { key: "telefone", label: "Cliques em telefone", Icon: Phone },
  { key: "outro", label: "Cliques em outros botões", Icon: MousePointerClick },
];

const RANGES = [
  { label: "Hoje", days: 1 },
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "Total", days: 0 },
];

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

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  function countRange(type: EventType, days: number): number {
    let since = 0;
    if (days === 1) since = startOfToday;
    else if (days > 1) {
      const d = new Date(today);
      d.setDate(d.getDate() - (days - 1));
      since = d.getTime();
    }
    let total = 0;
    for (const e of eventList) {
      if (e.event_type !== type) continue;
      if (days === 0 || new Date(e.created_at).getTime() >= since) total++;
    }
    return total;
  }

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

      <section className="panel overflow-hidden">
        <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] gap-2 border-b border-line bg-paper px-4 py-2.5 text-[11.5px] font-medium uppercase tracking-wide text-muted sm:px-5">
          <span>Métrica</span>
          {RANGES.map((r) => (
            <span key={r.label} className="text-right">
              {r.label}
            </span>
          ))}
        </div>

        {METRICS.map((m, i) => (
          <div
            key={m.key}
            className={`grid grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] items-center gap-2 px-4 py-3 sm:px-5 ${
              i === 0 ? "" : "border-t border-line"
            } transition-colors duration-150 hover:bg-paper`}
          >
            <span className="flex min-w-0 items-center gap-2 text-[13px] text-ink-soft">
              <m.Icon size={14} className="shrink-0 text-primary" />
              <span className="truncate">{m.label}</span>
            </span>
            {RANGES.map((r) => (
              <span
                key={r.label}
                className="text-right text-[14px] font-semibold tabular-nums text-ink"
              >
                {countRange(m.key, r.days)}
              </span>
            ))}
          </div>
        ))}
      </section>

      <p className="mt-3 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-muted">
        <Info size={13} className="mt-px shrink-0" />
        Agregação calculada a partir dos últimos 5.000 eventos registrados. Para volumes maiores,
        migre para uma função RPC <code className="font-mono">stats_for_site(site_id)</code> no Supabase.
      </p>
    </div>
  );
}
