"use client";

import { useMemo, useState } from "react";
import {
  CalendarRange, Eye, MessageCircle, Instagram, MapPin, Phone, MousePointerClick,
  Info, TrendingUp, TrendingDown, Minus, CalendarClock, type LucideIcon,
} from "lucide-react";
import type { EventType } from "@/lib/types";
import { conversion, deltaPct } from "@/components/admin/dashboard/types";

/** Evento compacto vindo do servidor: [timestamp em ms, tipo]. */
export type StatsEvent = [number, EventType];

const DAY = 86_400_000;

const METRICS: { key: EventType; label: string; Icon: LucideIcon }[] = [
  { key: "view", label: "Visualizações", Icon: Eye },
  { key: "whatsapp", label: "Cliques no WhatsApp", Icon: MessageCircle },
  { key: "instagram", label: "Cliques no Instagram", Icon: Instagram },
  { key: "comoChegar", label: "Cliques em Como chegar", Icon: MapPin },
  { key: "telefone", label: "Cliques em telefone", Icon: Phone },
  { key: "outro", label: "Cliques em outros botões", Icon: MousePointerClick },
];

type Preset = "today" | "7" | "30" | "90" | "all" | "custom";

const PRESETS: { key: Preset; label: string; days: number | null }[] = [
  { key: "today", label: "Hoje", days: 1 },
  { key: "7", label: "7 dias", days: 7 },
  { key: "30", label: "30 dias", days: 30 },
  { key: "90", label: "90 dias", days: 90 },
  { key: "all", label: "Tudo", days: null },
  { key: "custom", label: "Personalizado", days: null },
];

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/* ============================ Datas ============================ */

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function toInput(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fromInput(v: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).getTime();
}

function fmtDay(ts: number): string {
  return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function fmtLong(ts: number): string {
  return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtRange(from: number, to: number): string {
  if (from === to) return fmtLong(from);
  return `${fmtLong(from)} até ${fmtLong(to)}`;
}

function fmtNum(n: number): string {
  return n.toLocaleString("pt-BR");
}

/* ============================ Componente ============================ */

export function StatsView({ events, now }: { events: StatsEvent[]; now: number }) {
  const [preset, setPreset] = useState<Preset>("30");
  const [fromStr, setFromStr] = useState("");
  const [toStr, setToStr] = useState("");

  // Limites reais dos dados recebidos.
  const bounds = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const [t] of events) {
      if (t < min) min = t;
      if (t > max) max = t;
    }
    const today = startOfDay(now);
    if (!isFinite(min)) return { min: today, max: today };
    return { min: startOfDay(min), max: Math.min(startOfDay(max), today) };
  }, [events, now]);

  function pickPreset(key: Preset) {
    setPreset(key);
    if (key === "custom" && !fromStr && !toStr) {
      const today = startOfDay(now);
      setFromStr(toInput(today - 29 * DAY));
      setToStr(toInput(today));
    }
  }

  function pickCustom(field: "from" | "to", value: string) {
    setPreset("custom");
    if (field === "from") setFromStr(value);
    else setToStr(value);
  }

  const range = useMemo(() => {
    const today = startOfDay(now);
    let from: number;
    let to: number;
    switch (preset) {
      case "today":
        from = to = today;
        break;
      case "7":
        to = today;
        from = today - 6 * DAY;
        break;
      case "30":
        to = today;
        from = today - 29 * DAY;
        break;
      case "90":
        to = today;
        from = today - 89 * DAY;
        break;
      case "all":
        to = today;
        from = bounds.min;
        break;
      default: {
        const f = fromInput(fromStr);
        const t = fromInput(toStr);
        if (f === null || t === null) return null;
        from = Math.min(f, t);
        to = Math.max(f, t);
      }
    }
    return { from, to };
  }, [preset, fromStr, toStr, bounds.min, now]);

  const stats = useMemo(() => {
    if (!range) return null;
    const endTs = range.to + DAY;
    const lenDays = Math.round((range.to - range.from) / DAY) + 1;
    const prevFrom = range.from - lenDays * DAY;
    const prevEnd = range.from;

    const zero = () => ({ view: 0, whatsapp: 0, instagram: 0, comoChegar: 0, telefone: 0, outro: 0 });
    const cur = zero();
    const prev = zero();
    const all = zero();
    const byHour = new Array<number>(24).fill(0);
    const byWeekday = new Array<number>(7).fill(0);
    const perDay = new Map<string, { views: number; whatsapp: number }>();

    for (const [t, k] of events) {
      all[k]++;
      if (t >= range.from && t < endTs) {
        cur[k]++;
        const key = toInput(t);
        let d = perDay.get(key);
        if (!d) {
          d = { views: 0, whatsapp: 0 };
          perDay.set(key, d);
        }
        if (k === "view") d.views++;
        if (k === "whatsapp") d.whatsapp++;
        if (k === "view" || k === "whatsapp") {
          const dt = new Date(t);
          byHour[dt.getHours()]!++;
          byWeekday[dt.getDay()]!++;
        }
      } else if (t >= prevFrom && t < prevEnd) {
        prev[k]++;
      }
    }

    // Série diária contínua (inclui dias sem eventos).
    const days: { ts: number; views: number; whatsapp: number }[] = [];
    for (let i = 0; i < lenDays; i++) {
      const d = new Date(range.from);
      d.setDate(d.getDate() + i);
      const ts = d.getTime();
      const row = perDay.get(toInput(ts));
      days.push({ ts, views: row?.views ?? 0, whatsapp: row?.whatsapp ?? 0 });
    }

    // Barras: 1 dia por barra em períodos curtos; senão, agrupa.
    const size = lenDays <= 32 ? 1 : lenDays <= 100 ? 7 : 30;
    const buckets: { label: string; hint: string; views: number; whatsapp: number }[] = [];
    for (let i = 0; i < days.length; i += size) {
      const slice = days.slice(i, i + size);
      const first = slice[0]!;
      const last = slice[slice.length - 1]!;
      buckets.push({
        label: size === 1 ? fmtDay(first.ts) : fmtDay(first.ts),
        hint:
          size === 1
            ? fmtLong(first.ts)
            : `${fmtLong(first.ts)} a ${fmtLong(last.ts)}`,
        views: slice.reduce((a, d) => a + d.views, 0),
        whatsapp: slice.reduce((a, d) => a + d.whatsapp, 0),
      });
    }

    const totalInteractions = (Object.keys(cur) as EventType[]).reduce((a, k) => a + cur[k], 0);
    const prevInteractions = (Object.keys(prev) as EventType[]).reduce((a, k) => a + prev[k], 0);

    return {
      cur, prev, all, days, buckets, byHour, byWeekday, lenDays,
      totalInteractions, prevInteractions,
      peakDay: days.reduce((best, d) => (d.views > best.views ? d : best), days[0]!),
    };
  }, [events, range]);

  if (!range) {
    return (
      <p className="panel px-4 py-10 text-center text-[13px] text-muted">
        Escolha as datas <strong className="text-ink-soft">De</strong> e <strong className="text-ink-soft">Até</strong> para ver o período.
      </p>
    );
  }

  if (!stats) return null;

  const conv = conversion(stats.cur.view, stats.cur.whatsapp);
  const prevConv = conversion(stats.prev.view, stats.prev.whatsapp);
  const maxBar = Math.max(1, ...stats.buckets.map((b) => Math.max(b.views, b.whatsapp)));
  const maxHour = Math.max(1, ...stats.byHour);
  const maxWeekday = Math.max(1, ...stats.byWeekday);
  const rangeLabel = `${fmtRange(range.from, range.to)} · ${stats.lenDays} ${stats.lenDays === 1 ? "dia" : "dias"}`;

  return (
    <div className="space-y-4">
      {/* ---------------- Seletor de período ---------------- */}
      <section className="panel p-4 sm:p-5" aria-labelledby="periodo">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CalendarRange size={15} className="text-primary" />
              <h2 id="periodo" className="section-title">Período analisado</h2>
            </div>
            <p className="mt-1 text-[12px] text-muted">{rangeLabel}</p>
          </div>

          <div
            role="tablist"
            aria-label="Período"
            className="flex flex-wrap items-center gap-0.5 rounded-[10px] border border-line bg-paper p-0.5"
          >
            {PRESETS.map((p) => (
              <button
                key={p.key}
                role="tab"
                type="button"
                aria-selected={preset === p.key}
                onClick={() => pickPreset(p.key)}
                className={`rounded-[8px] px-2.5 py-1.5 text-[12px] font-medium transition duration-150 ${
                  preset === p.key ? "bg-white text-ink shadow-xs" : "text-muted hover:text-ink"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {preset === "custom" && (
          <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4">
            <label className="block">
              <span className="label">De</span>
              <input
                type="date"
                className="input-base w-[160px]"
                value={fromStr}
                min={toInput(bounds.min)}
                max={toInput(bounds.max)}
                onChange={(e) => pickCustom("from", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="label">Até</span>
              <input
                type="date"
                className="input-base w-[160px]"
                value={toStr}
                min={toInput(bounds.min)}
                max={toInput(bounds.max)}
                onChange={(e) => pickCustom("to", e.target.value)}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setFromStr(toInput(bounds.min));
                setToStr(toInput(bounds.max));
              }}
              className="btn-secondary btn-sm"
            >
              Usar todo o histórico
            </button>
            <p className="hint mt-0 max-w-[240px]">
              Toque nas datas para abrir o calendário. Os números mudam na hora.
            </p>
          </div>
        )}
      </section>

      {/* ---------------- Resumo ---------------- */}
      <section aria-label="Resumo do período" className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <SummaryCard
          label="Visualizações"
          value={stats.cur.view}
          delta={deltaPct(stats.cur.view, stats.prev.view)}
          sub="no período"
          Icon={Eye}
          tone="brand"
        />
        <SummaryCard
          label="Cliques no WhatsApp"
          value={stats.cur.whatsapp}
          delta={deltaPct(stats.cur.whatsapp, stats.prev.whatsapp)}
          sub="no período"
          Icon={MessageCircle}
          tone="ok"
        />
        <SummaryCard
          label="Conversão"
          value={`${conv}%`}
          delta={deltaPct(conv, prevConv)}
          sub="cliques ÷ visualizações"
          Icon={TrendingUp}
          tone={conv >= 30 ? "ok" : conv > 0 ? "warn" : "neutral"}
        />
        <SummaryCard
          label="Interações totais"
          value={stats.totalInteractions}
          delta={deltaPct(stats.totalInteractions, stats.prevInteractions)}
          sub="todos os botões"
          Icon={MousePointerClick}
          tone="neutral"
        />
      </section>

      {/* ---------------- Gráfico ---------------- */}
      <section className="panel p-4 sm:p-5" aria-labelledby="evolucao">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="evolucao" className="section-title">Evolução no período</h2>
            <p className="mt-1 text-[12px] text-muted">
              Visualizações e cliques no WhatsApp por {stats.buckets.length > 1 && stats.lenDays > 32 ? "faixa de dias" : "dia"}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11.5px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-[3px] bg-primary/85" aria-hidden="true" /> Visualizações
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-[3px] bg-okDot" aria-hidden="true" /> WhatsApp
            </span>
          </div>
        </div>

        {stats.cur.view === 0 && stats.cur.whatsapp === 0 ? (
          <p className="mt-5 rounded-[10px] border border-dashed border-line-strong bg-paper px-4 py-10 text-center text-[12.5px] leading-relaxed text-muted">
            Nenhum acesso registrado neste período. Escolha outro intervalo de datas.
          </p>
        ) : (
          <>
            <div className="mt-5 flex h-[170px] items-end gap-[3px]" role="img" aria-label={rangeLabel}>
              {stats.buckets.map((b, i) => (
                <div key={i} className="group relative flex h-full flex-1 items-end justify-center gap-px">
                  <Bar
                    label={`${b.hint} · ${b.views} visualizações`}
                    max={maxBar}
                    value={b.views}
                    color="bg-primary/85"
                    align={edgeAlign(i, stats.buckets.length)}
                  />
                  <Bar
                    label={`${b.hint} · ${b.whatsapp} cliques no WhatsApp`}
                    max={maxBar}
                    value={b.whatsapp}
                    color="bg-okDot"
                    align={edgeAlign(i, stats.buckets.length)}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10.5px] text-muted">
              <span>{fmtDay(stats.days[0]!.ts)}</span>
              {stats.days.length > 2 && (
                <span>{fmtDay(stats.days[Math.floor(stats.days.length / 2)]!.ts)}</span>
              )}
              <span>{fmtDay(stats.days[stats.days.length - 1]!.ts)}</span>
            </div>
          </>
        )}
      </section>

      {/* ---------------- Detalhe por métrica ---------------- */}
      <section className="panel overflow-hidden" aria-labelledby="detalhe">
        <h2 id="detalhe" className="section-title px-4 pt-4 sm:px-5">
          Detalhe por métrica
        </h2>
        <p className="mt-1 px-4 pb-3 text-[12px] text-muted sm:px-5">
          Valores do período, variação contra o período anterior e participação no total.
        </p>

        <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 border-y border-line bg-paper px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] sm:px-5">
          <span>Métrica</span>
          <span className="text-right">No período</span>
          <span className="text-right">Variação</span>
          <span className="hidden text-right sm:block">Participação</span>
        </div>

        {METRICS.map((m, i) => {
          const value = stats.cur[m.key];
          const share = stats.totalInteractions > 0 ? Math.round((value / stats.totalInteractions) * 100) : 0;
          return (
            <div
              key={m.key}
              className={`grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] sm:px-5 ${
                i === 0 ? "" : "border-t border-line"
              } transition-colors duration-150 hover:bg-paper`}
            >
              <span className="flex min-w-0 items-center gap-2 text-[13px] text-ink-soft">
                <m.Icon size={14} className="shrink-0 text-primary" />
                <span className="truncate">{m.label}</span>
              </span>
              <span className="text-right text-[14px] font-semibold tabular-nums text-ink">
                {fmtNum(value)}
              </span>
              <span className="flex justify-end">
                <Delta pct={deltaPct(value, stats.prev[m.key])} />
              </span>
              <span className="hidden items-center justify-end gap-2 sm:flex">
                <span className="h-1.5 w-full max-w-[80px] overflow-hidden rounded-full bg-paper-alt">
                  <span
                    className="block h-full rounded-full bg-primary/70 transition-[width] duration-500"
                    style={{ width: `${share}%` }}
                  />
                </span>
                <span className="w-9 text-right text-[11.5px] tabular-nums text-muted">{share}%</span>
              </span>
            </div>
          );
        })}
      </section>

      {/* ---------------- Quando as pessoas interagem ---------------- */}
      <section className="grid gap-4 lg:grid-cols-2" aria-label="Quando as pessoas interagem">
        <div className="panel p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <CalendarClock size={15} className="text-primary" />
            <h2 className="section-title">Melhores horários</h2>
          </div>
          <p className="mt-1 text-[12px] text-muted">Acessos e cliques por hora do dia</p>
          <div className="mt-4 flex h-[110px] items-end gap-[2px]" role="img" aria-label="Distribuição por hora">
            {stats.byHour.map((v, h) => (
              <div key={h} className="tip-wrap flex h-full flex-1 items-end">
                <span
                  className={`w-full origin-bottom rounded-t-[3px] transition-[height] duration-500 ${
                    v === 0 ? "bg-line" : "bg-primary/80"
                  }`}
                  style={{ height: v === 0 ? 2 : `${Math.max(4, Math.round((v / maxHour) * 100))}%` }}
                />
                <span className="tip" role="tooltip" style={TIP_STYLE[edgeAlign(h, stats.byHour.length)]}>
                  {`${String(h).padStart(2, "0")}:00 · ${v}`}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10.5px] text-muted">
            <span>00h</span>
            <span>06h</span>
            <span>12h</span>
            <span>18h</span>
            <span>23h</span>
          </div>
        </div>

        <div className="panel p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <CalendarRange size={15} className="text-primary" />
            <h2 className="section-title">Melhores dias da semana</h2>
          </div>
          <p className="mt-1 text-[12px] text-muted">Acessos e cliques por dia</p>
          <div className="mt-4 flex h-[110px] items-end gap-1.5" role="img" aria-label="Distribuição por dia da semana">
            {[1, 2, 3, 4, 5, 6, 0].map((d, i, arr) => {
              const v = stats.byWeekday[d] ?? 0;
              return (
                <div key={d} className="tip-wrap flex h-full flex-1 items-end">
                  <span
                    className={`w-full origin-bottom rounded-t-[3px] transition-[height] duration-500 ${
                      v === 0 ? "bg-line" : "bg-primary/80"
                    }`}
                    style={{ height: v === 0 ? 2 : `${Math.max(4, Math.round((v / maxWeekday) * 100))}%` }}
                  />
                  <span className="tip" role="tooltip" style={TIP_STYLE[edgeAlign(i, arr.length)]}>
                    {`${WEEKDAYS[d]} · ${v}`}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[10.5px] text-muted">
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <span key={d}>{WEEKDAYS[d]}</span>
            ))}
          </div>
        </div>
      </section>

      <p className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-muted">
        <Info size={13} className="mt-px shrink-0" />
        Agregação calculada a partir dos últimos 5.000 eventos registrados
        {stats.all.view + stats.all.whatsapp > 0 && (
          <> ({fmtNum(stats.all.view)} visualizações e {fmtNum(stats.all.whatsapp)} cliques no WhatsApp no total)</>
        )}
        . Para volumes maiores, migre para uma função RPC{" "}
        <code className="font-mono">stats_for_site(site_id)</code> no Supabase.
      </p>
    </div>
  );
}

/* ============================ Blocos ============================ */

function SummaryCard({
  label, value, delta, sub, Icon, tone = "neutral",
}: {
  label: string;
  value: number | string;
  delta: number | null;
  sub: string;
  Icon: LucideIcon;
  tone?: "neutral" | "ok" | "warn" | "brand";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-paper-alt text-ink-soft",
    ok: "bg-ok-50 text-ok",
    warn: "bg-warn-50 text-warn",
    brand: "bg-primary-50 text-primary",
  };
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-[9px] ${tones[tone]}`}>
          <Icon size={14} />
        </span>
        <span className="truncate text-[11.5px] font-medium text-ink-muted">{label}</span>
      </div>
      <p className="mt-2.5 text-[24px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
        {value}
      </p>
      <div className="mt-1.5 flex items-center gap-1.5">
        <Delta pct={delta} />
        <span className="text-[11px] text-muted">{sub}</span>
      </div>
    </div>
  );
}

function Delta({ pct }: { pct: number | null }) {
  if (pct === null || !Number.isFinite(pct)) {
    return <span className="text-[11px] text-muted">—</span>;
  }
  if (pct === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted">
        <Minus size={11} /> 0%
      </span>
    );
  }
  const up = pct > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium ${
        up ? "text-ok" : "text-danger"
      }`}
    >
      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {up ? "+" : ""}{pct}%
    </span>
  );
}

function Bar({
  label, max, value, color, align = "center",
}: {
  label: string; max: number; value: number; color: string;
  align?: TipAlign;
}) {
  const pct = value === 0 ? 0 : Math.max(4, Math.round((value / max) * 100));
  return (
    <span className="tip-wrap flex h-full w-full items-end">
      <span
        className={`w-full origin-bottom rounded-t-[3px] transition-[height] duration-500 ease-out ${
          value === 0 ? "bg-line" : color
        }`}
        style={{ height: value === 0 ? 2 : `${pct}%` }}
      />
      <span className="tip" role="tooltip" style={TIP_STYLE[align]}>{label}</span>
    </span>
  );
}

/**
 * Posição do tooltip. O `.tip` base centraliza via classes — como as barras
 * das pontas ficam perto da borda da tela, o texto longo vazava para fora
 * (inclusive gerando rolagem horizontal). Estilo inline resolve de forma
 * determinística, sem depender da ordem das classes do Tailwind.
 */
type TipAlign = "left" | "center" | "right";

const TIP_STYLE: Record<TipAlign, React.CSSProperties> = {
  left: { left: "0px", right: "auto", transform: "none" },
  center: { left: "50%", right: "auto", transform: "translateX(-50%)" },
  right: { left: "auto", right: "0px", transform: "none" },
};

/**
 * Escolhe o alinhamento pela posição relativa da barra. O tooltip tem ~244px,
 * então as barras de até 20% das pontas precisam encostar na borda.
 */
function edgeAlign(i: number, total: number): TipAlign {
  if (total < 3) return "center";
  const frac = i / (total - 1);
  if (frac <= 0.2) return "left";
  if (frac >= 0.8) return "right";
  return "center";
}
