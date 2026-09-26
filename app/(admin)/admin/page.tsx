import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Plus, Eye, Pencil, Trash2, BarChart3, ExternalLink, MessageCircle,
  CheckCircle2, Layers, TrendingUp, MoreHorizontal,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IconLink } from "@/components/ui/IconButton";
import type { SiteRow, EventRow } from "@/lib/supabase/database.types";
import type { Site } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ data: sites }, { data: events }] = await Promise.all([
    supabase.from("sites").select("*").order("updated_at", { ascending: false }),
    supabase
      .from("events")
      .select("site_id, event_type, created_at")
      .order("created_at", { ascending: false })
      .limit(5000),
  ]);

  const list = (sites ?? []) as SiteRow[];
  const eventList = (events ?? []) as Pick<EventRow, "site_id" | "event_type" | "created_at">[];

  const totals = list.reduce(
    (acc, s) => {
      acc.total++;
      if (s.status === "published") acc.published++;
      if (s.status === "draft") acc.draft++;
      return acc;
    },
    { total: 0, published: 0, draft: 0 },
  );

  const viewsBySite: Record<string, number> = {};
  const whatsappBySite: Record<string, number> = {};
  let viewsTotal = 0;
  let whatsappTotal = 0;
  eventList.forEach((e) => {
    if (e.event_type === "view") {
      viewsBySite[e.site_id] = (viewsBySite[e.site_id] ?? 0) + 1;
      viewsTotal++;
    }
    if (e.event_type === "whatsapp") {
      whatsappBySite[e.site_id] = (whatsappBySite[e.site_id] ?? 0) + 1;
      whatsappTotal++;
    }
  });

  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "smdigtal.com").toLowerCase();
  const nameById: Record<string, string> = {};
  list.forEach((s) => {
    const c = (s.company ?? {}) as Partial<Site["company"]>;
    nameById[s.id] = c.name || c.shortDesc || "(sem nome)";
  });

  // Série dos últimos 7 dias
  const series = buildSeries(eventList);

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-6 sm:px-6 sm:py-8">
      {/* Cabeçalho */}
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink sm:text-[26px]">
            Visão geral
          </h1>
          <p className="mt-1 text-[13.5px] text-muted">
            Acompanhe seus mini sites e resultados.
          </p>
        </div>
        <Link href="/admin/new" className="btn-primary shadow-sm">
          <Plus size={15} /> Criar mini site
        </Link>
      </header>

      {/* Métricas */}
      <section
        aria-label="Métricas"
        className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-5"
      >
        <Metric
          label="Total de mini sites"
          value={totals.total}
          Icon={Layers}
          sub={`${totals.published} publicado${totals.published === 1 ? "" : "s"}`}
        />
        <Metric label="Publicados" value={totals.published} Icon={CheckCircle2} tone="ok" />
        <Metric label="Em rascunho" value={totals.draft} Icon={Pencil} tone={totals.draft > 0 ? "warn" : "neutral"} />
        <Metric label="Visualizações" value={viewsTotal} Icon={Eye} sub="últimos 5.000 eventos" />
        <Metric label="Cliques no WhatsApp" value={whatsappTotal} Icon={MessageCircle} tone="ok" />
      </section>

      {/* Grid: listagem + lateral */}
      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Seus mini sites */}
        <section className="panel overflow-hidden" aria-labelledby="seus-sites">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
            <div>
              <h2 id="seus-sites" className="section-title">Seus mini sites</h2>
              <p className="mt-0.5 text-[12.5px] text-muted">
                {list.length === 0
                  ? "Você ainda não criou nenhum."
                  : `${list.length} ${list.length === 1 ? "site" : "sites"} no total.`}
              </p>
            </div>
            <Link href="/admin/new" className="btn-secondary btn-sm shrink-0">
              <Plus size={14} /> Criar
            </Link>
          </div>

          {list.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="divide-y divide-line">
              {list.map((s) => {
                const company = (s.company ?? {}) as Partial<Site["company"]>;
                const name = company.name || "(sem nome)";
                return (
                  <li
                    key={s.id}
                    className="group relative px-4 py-3 transition-colors duration-150 hover:bg-paper sm:px-5"
                  >
                    <div className="flex items-center gap-3">
                      <Thumb src={company.logoUrl} cover={company.coverUrl} name={name} />

                      <Link
                        href={`/admin/client/${s.id}`}
                        className="min-w-0 flex-1 rounded-md no-underline focus-visible:outline-none"
                      >
                        <span className="flex items-center gap-2">
                          <span className="truncate text-[14px] font-semibold tracking-[-0.01em] text-ink transition-colors duration-150 group-hover:text-primary">
                            {name}
                          </span>
                          {company.category && (
                            <span className="hidden shrink-0 rounded-md bg-paper-alt px-1.5 py-0.5 text-[11px] text-ink-muted sm:inline">
                              {company.category}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-muted">
                          <span className="truncate">{s.slug}.{root}</span>
                          <span className="hidden text-line-strong sm:inline">·</span>
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <Eye size={11} aria-hidden="true" />
                            {viewsBySite[s.id] ?? 0} visualizações
                          </span>
                        </span>
                      </Link>

                      <div className="hidden shrink-0 sm:block">
                        <StatusBadge status={s.status} />
                      </div>

                      <div className="flex shrink-0 items-center gap-0.5">
                        <IconLink label="Ver cliente" href={`/admin/client/${s.id}`}>
                          <Layers size={15} />
                        </IconLink>
                        <IconLink label="Editar" href={`/admin/edit/${s.id}`}>
                          <Pencil size={15} />
                        </IconLink>
                        <IconLink label="Analytics" href={`/admin/stats/${s.id}`}>
                          <BarChart3 size={15} />
                        </IconLink>
                        {s.status === "published" ? (
                          <IconLink label="Abrir site" href={`https://${s.slug}.${root}`} external>
                            <ExternalLink size={15} />
                          </IconLink>
                        ) : (
                          <span className="icon-btn cursor-not-allowed opacity-40" aria-hidden="true">
                            <ExternalLink size={15} />
                          </span>
                        )}
                        <IconLink label="Excluir" href={`/admin/delete/${s.id}`} danger>
                          <Trash2 size={15} />
                        </IconLink>
                      </div>
                    </div>

                    <div className="mt-2 sm:hidden">
                      <StatusBadge status={s.status} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Lateral */}
        <div className="space-y-4">
          <Performance series={series} viewsTotal={viewsTotal} whatsappTotal={whatsappTotal} />
          <RecentActivity events={eventList} nameById={nameById} root={root} slugById={slugOf(list)} />
        </div>
      </div>
    </div>
  );
}

/* ============================ Blocos ============================ */

function Metric({
  label, value, Icon, sub, tone = "neutral",
}: {
  label: string;
  value: number;
  Icon: React.ComponentType<{ size?: number }>;
  sub?: string;
  tone?: "neutral" | "ok" | "warn";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-paper-alt text-ink-soft",
    ok: "bg-ok-50 text-ok",
    warn: "bg-warn-50 text-warn",
  };
  return (
    <div className="card card-hover flex flex-col gap-2.5 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11.5px] font-medium leading-tight text-muted">{label}</p>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] ${tones[tone]}`}>
          <Icon size={14} />
        </span>
      </div>
      <p className="text-[26px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
        {String(value).padStart(2, "0")}
      </p>
      {sub && <p className="text-[11px] leading-tight text-muted">{sub}</p>}
    </div>
  );
}

function Thumb({
  src, cover, name,
}: { src?: string; cover?: string; name: string }) {
  return (
    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-line bg-paper-alt">
      {src || cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src || cover} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="text-[13px] font-semibold text-ink-muted">{name.slice(0, 1).toUpperCase()}</span>
      )}
    </span>
  );
}

type DayPoint = { label: string; views: number; whatsapp: number };

function Performance({
  series, viewsTotal, whatsappTotal,
}: { series: DayPoint[]; viewsTotal: number; whatsappTotal: number }) {
  const max = Math.max(1, ...series.map((d) => Math.max(d.views, d.whatsapp)));

  return (
    <section className="panel p-4 sm:p-5" aria-labelledby="desempenho">
      <div className="flex items-center gap-2">
        <TrendingUp size={15} className="text-primary" />
        <h2 id="desempenho" className="section-title">Desempenho dos seus sites</h2>
      </div>
      <p className="mt-1 text-[12px] text-muted">Últimos 7 dias</p>

      {viewsTotal === 0 && whatsappTotal === 0 ? (
        <p className="mt-4 rounded-[10px] border border-dashed border-line-strong bg-paper px-3 py-6 text-center text-[12.5px] leading-relaxed text-muted">
          Os dados aparecerão aqui conforme seus sites receberem acessos.
        </p>
      ) : (
        <>
          <div className="mt-4 flex h-[112px] items-end gap-1.5">
            {series.map((d) => (
              <div key={d.label} className="group flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-[84px] w-full items-end justify-center gap-0.5">
                  <Bar
                    value={d.views}
                    max={max}
                    className="bg-primary/85"
                    label={`${d.views} visualizações`}
                  />
                  <Bar
                    value={d.whatsapp}
                    max={max}
                    className="bg-okDot"
                    label={`${d.whatsapp} cliques no WhatsApp`}
                  />
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted">
                  {d.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-4 border-t border-line pt-3">
            <Legend color="bg-primary/85" label="Visualizações" value={viewsTotal} />
            <Legend color="bg-okDot" label="WhatsApp" value={whatsappTotal} />
          </div>
        </>
      )}
    </section>
  );
}

function Bar({ value, max, className, label }: { value: number; max: number; className: string; label: string }) {
  const empty = value === 0;
  const pct = empty ? 0 : Math.max(8, Math.round((value / max) * 100));
  return (
    <span className="tip-wrap flex h-full w-full items-end">
      <span
        className={`w-full origin-bottom rounded-t-[3px] animate-grow ${empty ? "bg-line-strong" : className}`}
        style={{ height: empty ? 2 : `${pct}%` }}
      />
      <span className="tip" role="tooltip">{label}</span>
    </span>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-[3px] ${color}`} aria-hidden="true" />
      <span className="text-[11.5px] text-muted">{label}</span>
      <span className="text-[12.5px] font-semibold tabular-nums text-ink">{value}</span>
    </div>
  );
}

const EVENT_LABEL: Record<string, string> = {
  view: "visualização",
  whatsapp: "clique no WhatsApp",
  instagram: "clique no Instagram",
  comoChegar: "clique em Como chegar",
  telefone: "clique em telefone",
  outro: "clique em um botão",
};

function RecentActivity({
  events, nameById, slugById, root,
}: {
  events: Pick<EventRow, "site_id" | "event_type" | "created_at">[];
  nameById: Record<string, string>;
  slugById: Record<string, string>;
  root: string;
}) {
  const recent = events.slice(0, 8);

  return (
    <section className="panel p-4 sm:p-5" aria-labelledby="atividade">
      <div className="flex items-center gap-2">
        <MoreHorizontal size={15} className="text-primary" />
        <h2 id="atividade" className="section-title">Atividade recente</h2>
      </div>

      {recent.length === 0 ? (
        <p className="mt-4 rounded-[10px] border border-dashed border-line-strong bg-paper px-3 py-6 text-center text-[12.5px] leading-relaxed text-muted">
          Assim que seus sites receberem acessos, você verá aqui a atividade mais recente.
        </p>
      ) : (
        <ul className="mt-3.5 space-y-3">
          {recent.map((e, i) => {
            const name = nameById[e.site_id] ?? "Cliente";
            const slug = slugById[e.site_id];
            return (
              <li key={`${e.site_id}-${e.created_at}-${i}`} className="flex gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/35" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-[12.5px] leading-snug text-ink-soft">
                    {slug ? (
                      <Link href={`/admin/client/${e.site_id}`} className="font-medium text-ink hover:text-primary">
                        {name}
                      </Link>
                    ) : (
                      <span className="font-medium text-ink">{name}</span>
                    )}{" "}
                    recebeu 1 {EVENT_LABEL[e.event_type] ?? "evento"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {relative(new Date(e.created_at).getTime())}
                    {slug && <> · {slug}.{root}</>}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-14 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
        <Layers size={20} />
      </span>
      <p className="mt-3.5 text-[14px] font-medium text-ink">Nenhum mini site ainda</p>
      <p className="mx-auto mt-1 max-w-[320px] text-[12.5px] leading-relaxed text-muted">
        Escolha um modelo visual e cadastre o primeiro cliente. O site fica no ar em menos de um minuto.
      </p>
      <Link href="/admin/new" className="btn-primary mt-4">
        <Plus size={15} /> Criar mini site
      </Link>
    </div>
  );
}

/* ============================ Helpers ============================ */

function slugOf(list: SiteRow[]): Record<string, string> {
  const m: Record<string, string> = {};
  list.forEach((s) => { m[s.id] = s.slug; });
  return m;
}

function buildSeries(
  events: Pick<EventRow, "site_id" | "event_type" | "created_at">[],
): DayPoint[] {
  type Slot = DayPoint & { key: string };
  const now = new Date();
  const slots: Slot[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    slots.push({
      key: dayKey(d),
      label: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "").slice(0, 3),
      views: 0,
      whatsapp: 0,
    });
  }
  const idx = new Map(slots.map((s, i) => [s.key, i]));
  events.forEach((e) => {
    const i = idx.get(dayKey(new Date(e.created_at)));
    if (i === undefined) return;
    if (e.event_type === "view") slots[i]!.views++;
    else if (e.event_type === "whatsapp") slots[i]!.whatsapp++;
  });
  return slots.map(({ key: _key, ...rest }) => rest);
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function relative(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  if (d === 1) return "ontem";
  if (d < 7) return `há ${d} dias`;
  return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
