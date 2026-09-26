"use client";

import { useMemo } from "react";
import { TrendingUp, Eye, MessageCircle } from "lucide-react";
import { RANGES, conversion, sumSeries, type DayStat, type RangeKey } from "./types";

type Props = {
  series: Record<RangeKey, DayStat[]>;
  range: RangeKey;
  onRange: (r: RangeKey) => void;
};

export function PerformanceChart({ series, range, onRange }: Props) {
  const data = series[range] ?? [];
  const totals = useMemo(() => sumSeries(data), [data]);
  const pct = conversion(totals.views, totals.whatsapp);

  //視Aggregation for readability: 90 days → 15 buckets
  const points = useMemo(() => bucket(data, range), [data, range]);
  const max = Math.max(1, ...points.map((p) => Math.max(p.views, p.whatsapp)));

  return (
    <section className="panel p-4 sm:p-5" aria-labelledby="desempenho">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-primary" />
            <h2 id="desempenho" className="section-title">Desempenho dos seus sites</h2>
          </div>
          <p className="mt-1 text-[12px] text-muted">Visualizações e cliques no WhatsApp por período</p>
        </div>

        <div
          role="tablist"
          aria-label="Período do gráfico"
          className="flex shrink-0 items-center gap-0.5 rounded-[10px] border border-line bg-paper p-0.5"
        >
          {RANGES.map((r) => (
            <button
              key={r.key}
              role="tab"
              type="button"
              aria-selected={range === r.key}
              onClick={() => onRange(r.key)}
              className={`rounded-[8px] px-2.5 py-1.5 text-[12px] font-medium transition duration-150 ${
                range === r.key
                  ? "bg-white text-ink shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {totals.views === 0 && totals.whatsapp === 0 ? (
        <EmptyPerformance />
      ) : (
        <>
          <div className="mt-5 flex h-[150px] items-end gap-[3px]" role="img" aria-label={`Visualizações ${totals.views}, cliques no WhatsApp ${totals.whatsapp}`}>
            {points.map((p, i) => (
              <div key={i} className="group relative flex h-full flex-1 items-end justify-center gap-px">
                <Tooltip label={`${p.views} visualizações`} max={max} value={p.views} color="bg-primary/85" />
                <Tooltip label={`${p.whatsapp} cliques no WhatsApp`} max={max} value={p.whatsapp} color="bg-okDot" />
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
            <Summary icon={<Eye size={12} />} color="bg-primary/85" label="Visualizações" value={totals.views} />
            <Summary icon={<MessageCircle size={12} />} color="bg-okDot" label="Cliques" value={totals.whatsapp} />
            <Summary icon={null} color="" label="Conversão" value={`${pct}%`} />
          </div>
        </>
      )}
    </section>
  );
}

function Tooltip({
  label, max, value, color,
}: { label: string; max: number; value: number; color: string }) {
  const pct = value === 0 ? 0 : Math.max(4, Math.round((value / max) * 100));
  return (
    <span className="tip-wrap flex h-full w-full items-end">
      <span
        className={`w-full origin-bottom rounded-t-[3px] transition-[height] duration-500 ease-out ${
          value === 0 ? "bg-line" : color
        }`}
        style={{ height: value === 0 ? 2 : `${pct}%` }}
      />
      <span className="tip" role="tooltip">{label}</span>
    </span>
  );
}

function Summary({
  icon, color, label, value,
}: { icon: React.ReactNode; color: string; label: string; value: number | string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11.5px] text-muted">
        {color && <span className={`h-2 w-2 rounded-[3px] ${color}`} aria-hidden="true" />}
        {icon}
        {label}
      </p>
      <p className="mt-0.5 text-[18px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-ink">
        {value}
      </p>
    </div>
  );
}

function EmptyPerformance() {
  return (
    <p className="mt-5 rounded-[10px] border border-dashed border-line-strong bg-paper px-4 py-10 text-center text-[12.5px] leading-relaxed text-muted">
      Os dados aparecerão aqui conforme seus sites receberem acessos.
    </p>
  );
}

/** Agrupa dias em buckets para o gráfico não virar uma parede de barras. */
function bucket(data: DayStat[], range: RangeKey): DayStat[] {
  const size = range === "7" ? 1 : range === "30" ? 2 : 6;
  if (data.length <= 1) return data;
  const out: DayStat[] = [];
  for (let i = 0; i < data.length; i += size) {
    let views = 0;
    let whatsapp = 0;
    for (let j = i; j < Math.min(i + size, data.length); j++) {
      views += data[j]!.views;
      whatsapp += data[j]!.whatsapp;
    }
    out.push({ views, whatsapp });
  }
  return out;
}
