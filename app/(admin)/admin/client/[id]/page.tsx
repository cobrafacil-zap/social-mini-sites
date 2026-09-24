import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rowToSite } from "@/lib/mappers";
import { fullAddress } from "@/lib/links";
import { Pencil, Trash2, ExternalLink, BarChart3, Eye, MessageCircle, Instagram, MapPin, Phone, MousePointerClick, ArrowLeft } from "lucide-react";
import type { EventType } from "@/lib/types";
import type { SiteRow, EventRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

const METRICS: { key: EventType; label: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { key: "view", label: "Visualizações", Icon: Eye },
  { key: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "comoChegar", label: "Como chegar", Icon: MapPin },
  { key: "telefone", label: "Telefone", Icon: Phone },
  { key: "outro", label: "Outros botões", Icon: MousePointerClick },
];

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: row }, { data: events }] = await Promise.all([
    supabase.from("sites").select("*").eq("id", id).single(),
    supabase.from("events").select("event_type, created_at").eq("site_id", id).order("created_at", { ascending: false }).limit(5000),
  ]);

  if (!row) notFound();
  const site = rowToSite(row as unknown as SiteRow);
  const eventList = (events ?? []) as Pick<EventRow, "event_type" | "created_at">[];
  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "smdigtal.com").toLowerCase();
  const publicUrl = `https://${site.slug}.${root}`;

  const totals: Record<EventType, number> = { view: 0, whatsapp: 0, instagram: 0, comoChegar: 0, telefone: 0, outro: 0 };
  eventList.forEach((e) => { if (totals[e.event_type as EventType] !== undefined) totals[e.event_type as EventType]++; });

  return (
    <div className="max-w-[980px] mx-auto px-6 pt-6 pb-16">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-[13.5px] text-neutral-700 no-underline mb-4">
        <ArrowLeft size={15} /> Voltar
      </Link>

      {/* Header cliente */}
      <div className="bg-white border border-line rounded-xl p-5 flex gap-4 items-start">
        <div className="w-[64px] h-[64px] rounded-xl overflow-hidden bg-[#F1F5F2] border border-line flex items-center justify-center shrink-0">
          {site.company.logoUrl ? <img src={site.company.logoUrl} alt="logo" className="w-full h-full object-cover" /> : <span className="text-[11px] text-muted">sem logo</span>}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[18px] font-bold uppercase tracking-wide text-ink truncate">{site.company.name || "(sem nome)"}</h1>
          <p className="text-[12.5px] text-muted">{site.slug}.{root} • {site.company.category || site.template}</p>
          <p className="text-[12.5px] text-muted mt-1 line-clamp-2">{site.company.shortDesc || site.company.slogan || "—"}</p>
        </div>
        <StatusBadge status={site.status} />
      </div>

      {/* Ações */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Link href={`/admin/edit/${site.id}`} className="inline-flex items-center gap-1.5 bg-primary text-white rounded-lg px-4 py-2 text-[13px] font-semibold no-underline">
          <Pencil size={14} /> Editar
        </Link>
        <Link href={`/admin/stats/${site.id}`} className="inline-flex items-center gap-1.5 bg-white border border-line rounded-lg px-4 py-2 text-[13px] font-medium text-ink no-underline">
          <BarChart3 size={14} /> Estatísticas
        </Link>
        {site.status === "published" && (
          <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-white border border-line rounded-lg px-4 py-2 text-[13px] font-medium text-ink no-underline">
            <ExternalLink size={14} /> Ver mini site
          </a>
        )}
        <Link href={`/admin/delete/${site.id}`} className="inline-flex items-center gap-1.5 bg-white border border-danger/30 text-danger rounded-lg px-4 py-2 text-[13px] font-medium no-underline">
          <Trash2 size={14} /> Excluir cliente
        </Link>
      </div>

      {/* Dashboard do cliente - acessos */}
      <div className="mt-6">
        <h2 className="text-[14px] font-bold uppercase tracking-wide text-ink mb-2">Dashboard do cliente</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {METRICS.map((m) => (
            <div key={m.key} className="bg-white border border-line rounded-xl p-4">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted mb-1">
                <m.Icon size={13} color="#145C4B" /> {m.label}
              </div>
              <p className="text-[20px] font-bold text-ink">{totals[m.key]}</p>
            </div>
          ))}
        </div>
        <p className="text-[11.5px] text-muted mt-2">Baseado nos últimos 5.000 eventos.</p>
      </div>

      {/* Infos */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-line rounded-xl p-5">
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-ink mb-3">Informações</h3>
          <div className="space-y-2 text-[13px]">
            <Row label="Telefone" value={site.company.phone || "—"} />
            <Row label="WhatsApp" value={site.company.whatsapp || "—"} />
            <Row label="E-mail" value={site.company.email || "—"} />
            <Row label="Instagram" value={site.company.instagram || "—"} />
            <Row label="Facebook" value={site.company.facebook || "—"} />
            <Row label="Site" value={site.company.website || "—"} />
          </div>
        </div>
        <div className="bg-white border border-line rounded-xl p-5">
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-ink mb-3">Localização e horário</h3>
          <div className="space-y-2 text-[13px]">
            <Row label="Endereço" value={fullAddress(site.location) || "—"} />
            <div>
              <p className="text-[12px] font-semibold text-muted uppercase tracking-wide">Horários</p>
              <div className="mt-1 grid grid-cols-2 gap-1 text-[12.5px]">
                {Object.entries(site.hours).map(([k, v]) => (
                  <span key={k} className="flex justify-between border-b border-line/50 py-1">
                    <span className="font-medium">{k}</span>
                    <span className={v.closed ? "text-muted" : "text-ink"}>{v.closed ? "Fechado" : `${v.open}–${v.close}`}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-line rounded-xl p-5">
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-ink mb-3">Galeria</h3>
          {site.gallery.length === 0 ? (
            <p className="text-[13px] text-muted">Nenhuma foto.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {site.gallery.slice(0, 6).map((g) => (
                <img key={g.id} src={g.url} alt="" className="w-full h-[80px] object-cover rounded-lg" />
              ))}
            </div>
          )}
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-ink mt-4 mb-2">Botões</h3>
          {site.buttons.length === 0 ? <p className="text-[13px] text-muted">Nenhum botão.</p> : <ul className="text-[13px] space-y-1">{site.buttons.map((b) => <li key={b.id}>• {b.name} — {b.link || "sem link"}</li>)}</ul>}
        </div>
        <div className="bg-white border border-line rounded-xl p-5">
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-ink mb-3">Aparência</h3>
          <div className="flex gap-2 mb-3">
            {([site.customization.primary, site.customization.secondary, site.customization.background, site.customization.text] as string[]).map((color, i) => (
              <span key={i} className="w-8 h-8 rounded-full border border-black/10" style={{ background: color }} title={color} />
            ))}
          </div>
          <Row label="Estilo botões" value={site.customization.buttonStyle} />
          {site.company.coverUrl && <img src={site.company.coverUrl} alt="capa" className="mt-3 w-full h-[110px] object-cover rounded-lg border border-line" style={{ objectPosition: site.company.coverPosition || "50% 50%" }} />}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted shrink-0">{label}</span>
      <span className="text-ink font-medium truncate text-right">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    draft: { label: "Rascunho", bg: "#FBF3DF", fg: "#93650F" },
    published: { label: "Publicado", bg: "#E4F3EC", fg: "#0E6B4F" },
    disabled: { label: "Desativado", bg: "#F1E7E6", fg: "#9C3B31" },
  };
  const s = map[status] ?? map.draft;
  return <span className="px-2.5 py-1 rounded-md text-xs font-medium shrink-0" style={{ background: s.bg, color: s.fg }}>{s.label}</span>;
}
