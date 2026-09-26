import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rowToSite } from "@/lib/mappers";
import { fullAddress } from "@/lib/links";
import {
  Pencil, Trash2, ExternalLink, BarChart3, Eye, MessageCircle,
  Instagram, MapPin, Phone, MousePointerClick, ArrowLeft, Globe, Mail, Store,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { EventType } from "@/lib/types";
import type { SiteRow, EventRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

const METRICS: { key: EventType; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
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
  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "smdigtal.com").toLowerCase();
  const publicUrl = `https://${site.slug}.${root}`;

  const totals: Record<EventType, number> = {
    view: 0, whatsapp: 0, instagram: 0, comoChegar: 0, telefone: 0, outro: 0,
  };
  eventList.forEach((e) => {
    const k = e.event_type as EventType;
    if (totals[k] !== undefined) totals[k]++;
  });

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/admin" className="btn-ghost btn-sm -ml-2 mb-4">
        <ArrowLeft size={14} /> Voltar
      </Link>

      {/* Cabeçalho do cliente */}
      <section className="panel overflow-hidden">
        <div className="flex items-center gap-3.5 p-4 sm:p-5">
          <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-paper-alt">
            {site.company.logoUrl || site.company.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={site.company.logoUrl || site.company.coverUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Store size={22} className="text-ink-muted" />
            )}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-[18px] font-semibold tracking-[-0.02em] text-ink sm:text-[20px]">
                {site.company.name || "(sem nome)"}
              </h1>
              <StatusBadge status={site.status} />
            </div>
            <p className="mt-1 truncate text-[12.5px] text-muted">
              {site.slug}.{root}
              {site.company.category && <span className="text-line-strong"> · </span>}
              {site.company.category}
            </p>
            {(site.company.shortDesc || site.company.slogan) && (
              <p className="mt-1.5 line-clamp-2 max-w-[60ch] text-[12.5px] leading-relaxed text-ink-soft">
                {site.company.shortDesc || site.company.slogan}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-line bg-paper px-4 py-3 sm:px-5">
          <Link href={`/admin/edit/${site.id}`} className="btn-primary btn-sm">
            <Pencil size={14} /> Editar
          </Link>
          <Link href={`/admin/stats/${site.id}`} className="btn-secondary btn-sm">
            <BarChart3 size={14} /> Estatísticas
          </Link>
          {site.status === "published" && (
            <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm">
              <ExternalLink size={14} /> Abrir site
            </a>
          )}
          <Link href={`/admin/delete/${site.id}`} className="btn-danger btn-sm ml-auto">
            <Trash2 size={14} /> Excluir cliente
          </Link>
        </div>
      </section>

      {/* Dashboard */}
      <section className="mt-5" aria-labelledby="dash-cliente">
        <div className="mb-2.5 flex items-baseline justify-between gap-3">
          <h2 id="dash-cliente" className="section-title">Dashboard do cliente</h2>
          <p className="text-[11.5px] text-muted">Últimos 5.000 eventos</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {METRICS.map((m) => (
            <div key={m.key} className="card card-hover p-3.5">
              <div className="flex items-center gap-1.5 text-ink-muted">
                <m.Icon size={14} />
                <span className="truncate text-[11.5px] font-medium">{m.label}</span>
              </div>
              <p className="mt-2 text-[22px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
                {totals[m.key]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Detalhes */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Info title="Informações de contato">
          <Row icon={Phone} label="Telefone" value={site.company.phone} href={site.company.phone ? `tel:${site.company.phone}` : undefined} />
          <Row icon={MessageCircle} label="WhatsApp" value={site.company.whatsapp} />
          <Row icon={Mail} label="E-mail" value={site.company.email} href={site.company.email ? `mailto:${site.company.email}` : undefined} />
          <Row icon={Instagram} label="Instagram" value={site.company.instagram} href={site.company.instagram ? `https://instagram.com/${site.company.instagram.replace(/^@/, "")}` : undefined} />
          <Row icon={Globe} label="Facebook" value={site.company.facebook} href={site.company.facebook ? `https://${site.company.facebook.replace(/^https?:\/\//, "")}` : undefined} />
          <Row icon={Globe} label="Site" value={site.company.website} href={site.company.website ? `https://${site.company.website.replace(/^https?:\/\//, "")}` : undefined} />
        </Info>

        <Info title="Localização e horários">
          <Row icon={MapPin} label="Endereço" value={fullAddress(site.location)} />
          <div className="mt-3 border-t border-line pt-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Horários de funcionamento</p>
            <dl className="mt-2 grid grid-cols-2 gap-x-4">
              {Object.entries(site.hours).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between gap-2 border-b border-line-soft py-1.5 last:border-0"
                >
                  <dt className="text-[12px] capitalize text-ink-soft">{k}</dt>
                  <dd className={`text-[12px] tabular-nums ${v.closed ? "text-muted" : "font-medium text-ink"}`}>
                    {v.closed ? "Fechado" : `${v.open} – ${v.close}`}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Info>

        <Info title="Galeria">
          {site.gallery.length === 0 ? (
            <Empty text="Nenhuma foto enviada." />
          ) : (
            <ul className="grid grid-cols-3 gap-2">
              {site.gallery.slice(0, 6).map((g) => (
                <li key={g.id} className="overflow-hidden rounded-[9px] border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.url} alt="" className="h-[74px] w-full object-cover" />
                </li>
              ))}
            </ul>
          )}
        </Info>

        <Info title="Botões comerciais">
          {site.buttons.length === 0 ? (
            <Empty text="Nenhum botão configurado." />
          ) : (
            <ul className="space-y-1.5">
              {[...site.buttons].sort((a, b) => a.order - b.order).map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 text-[12.5px]">
                  <span className="truncate font-medium text-ink-soft">{b.name}</span>
                  <span className="truncate text-[11.5px] text-muted">{b.link || "sem link"}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 border-t border-line pt-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Aparência</p>
            <div className="mt-2.5 flex items-center gap-1.5">
              {(
                [
                  site.customization.primary,
                  site.customization.secondary,
                  site.customization.background,
                  site.customization.text,
                ] as string[]
              ).map((color, i) => (
                <span
                  key={i}
                  title={color}
                  className="h-7 w-7 rounded-lg border border-line"
                  style={{ background: color }}
                />
              ))}
              <span className="ml-1.5 text-[11.5px] text-muted">
                Botões {site.customization.buttonStyle === "pill" ? "pílula" : site.customization.buttonStyle === "square" ? "quadrados" : "arredondados"}
              </span>
            </div>
            {site.company.coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={site.company.coverUrl}
                alt="Capa do mini site"
                className="mt-3 h-[110px] w-full rounded-[9px] border border-line object-cover"
                style={{ objectPosition: site.company.coverPosition || "50% 50%" }}
              />
            )}
          </div>
        </Info>
      </div>
    </div>
  );
}

/* ============================ Blocos ============================ */

function Info({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel p-4 sm:p-5">
      <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-ink-muted">{title}</h3>
      {children}
    </section>
  );
}

function Row({
  icon: Icon, label, value, href,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value?: string;
  href?: string;
}) {
  const v = value?.trim();
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line-soft py-1.5 last:border-0">
      <span className="flex shrink-0 items-center gap-2 text-[12.5px] text-muted">
        <Icon size={13} className="opacity-70" />
        {label}
      </span>
      {v ? (
        href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-[12.5px] font-medium text-ink no-underline hover:text-primary"
          >
            {v}
          </a>
        ) : (
          <span className="truncate text-[12.5px] font-medium text-ink">{v}</span>
        )
      ) : (
        <span className="text-[12.5px] text-[#B4BBB7]">—</span>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-[9px] border border-dashed border-line-strong bg-paper px-3 py-5 text-center text-[12.5px] text-muted">
      {text}
    </p>
  );
}
