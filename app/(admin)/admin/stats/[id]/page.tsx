import Link from "next/link";
import { ArrowLeft, Eye, MessageCircle, Instagram, MapPin, Phone, MousePointerClick } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { rowToSite } from "@/lib/mappers";
import type { EventType } from "@/lib/types";

export const dynamic = "force-dynamic";

const METRICS: { key: EventType; label: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { key: "view", label: "Visualizações", Icon: Eye },
  { key: "whatsapp", label: "Cliques no WhatsApp", Icon: MessageCircle },
  { key: "instagram", label: "Cliques no Instagram", Icon: Instagram },
  { key: "comoChegar", label: 'Cliques em "Como chegar"', Icon: MapPin },
  { key: "telefone", label: "Cliques em telefone", Icon: Phone },
  { key: "outro", label: "Cliques em outros botões", Icon: MousePointerClick },
];

const RANGES = [
  { label: "Hoje", days: 1 },
  { label: "Últimos 7 dias", days: 7 },
  { label: "Últimos 30 dias", days: 30 },
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
  const site = rowToSite(row);

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  function countRange(type: EventType, days: number): number {
    if (!events) return 0;
    let since = 0;
    if (days === 1) since = startOfToday;
    else {
      const d = new Date(today);
      d.setDate(d.getDate() - (days - 1));
      since = d.getTime();
    }
    let total = 0;
    for (const e of events) {
      if (e.event_type !== type) continue;
      const t = new Date(e.created_at).getTime();
      if (t >= since) total++;
    }
    return total;
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 pt-7 pb-16">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-[13.5px] text-neutral-700 no-underline mb-[18px]">
        <ArrowLeft size={15} /> Voltar ao painel
      </Link>
      <h1 className="text-[19px] font-semibold text-ink mb-0.5">{site.company.name || "(sem nome)"}</h1>
      <p className="text-[13px] text-[#8B8B85] mb-[22px]">{(process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "smdigital.com")} / {site.slug}</p>

      <div className="bg-white border border-line rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] py-3 px-[18px] bg-[#FAFAF7] text-[12.5px] font-semibold text-muted">
          <span>Métrica</span>
          {RANGES.map((r) => (
            <span key={r.label} className="text-right">{r.label}</span>
          ))}
        </div>
        {METRICS.map((m, i) => (
          <div
            key={m.key}
            className={`grid grid-cols-[2fr_1fr_1fr_1fr] py-3.5 px-[18px] items-center ${
              i === 0 ? "" : "border-t border-[#EFEEE9]"
            }`}
          >
            <span className="flex items-center gap-2 text-[13.5px] text-ink">
              <m.Icon size={15} color="#145C4B" />
              {m.label}
            </span>
            {RANGES.map((r) => (
              <span key={r.label} className="text-right text-[14px] font-semibold text-ink">
                {countRange(m.key, r.days)}
              </span>
            ))}
          </div>
        ))}
      </div>

      <p className="text-[12px] text-muted mt-3">
        Agregação client-side dos últimos 5.000 eventos. Para volumes maiores,
        substitua por uma função RPC <code>stats_for_site(site_id)</code> no Supabase.
      </p>
    </div>
  );
}