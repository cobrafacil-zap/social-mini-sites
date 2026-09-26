"use client";

import { useMemo } from "react";
import { MousePointerClick, TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { conversion, deltaPct } from "./types";
type Props = {
  label: string;
  value: number;
  Icon: LucideIcon;
  tone?: "neutral" | "ok" | "warn" | "brand";
  sub?: string;
  delta?: number | null;
  deltaLabel?: string;
  onClick?: () => void;
  active?: boolean;
  hint?: string;
};

/**
 * Card de métrica. Número grande, label pequena, comparação real
 * (delta vs período anterior) e clique opcional como filtro.
 */
export function MetricCard({
  label, value, Icon, tone = "neutral", sub, delta, deltaLabel, onClick, active, hint,
}: Props) {
  const tones: Record<string, string> = {
    neutral: "bg-paper-alt text-ink-soft",
    ok: "bg-ok-50 text-ok",
    warn: "bg-warn-50 text-warn",
    brand: "bg-primary-50 text-primary",
  };

  const clickable = !!onClick;
  const Tag = (clickable ? "button" : "div") as "button" | "div";

  const trend = useMemo(() => {
    if (delta === null || delta === undefined) return null;
    if (delta > 0) return { Icon: TrendingUp, cls: "text-ok", text: `+${delta}%` };
    if (delta < 0) return { Icon: TrendingDown, cls: "text-danger", text: `${delta}%` };
    return { Icon: Minus, cls: "text-muted", text: "0%" };
  }, [delta]);

  return (
    <Tag
      {...(clickable
        ? { type: "button" as const, onClick, "aria-pressed": !!active }
        : {})}
      className={`card group relative flex w-full flex-col gap-3 p-4 text-left ${
        active ? "border-primary/40 shadow-card ring-1 ring-primary/15" : "card-hover"
      } ${clickable ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11.5px] font-medium leading-tight text-muted">{label}</p>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] transition duration-200 ${tones[tone]}`}>
          <Icon size={14} />
        </span>
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-[30px] font-semibold leading-none tracking-[-0.035em] tabular-nums text-ink">
          {String(value).padStart(2, "0")}
        </span>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-[11.5px] font-semibold tabular-nums ${trend.cls}`}>
            <trend.Icon size={12} />
            {trend.text}
          </span>
        )}
      </div>

      <p className="mt-auto text-[11.5px] leading-tight text-muted">
        {sub ?? deltaLabel ?? " "}
      </p>
    </Tag>
  );
}

export function ConversionCard({
  views, whatsapp, onClick, active,
}: { views: number; whatsapp: number; onClick?: () => void; active?: boolean }) {
  const pct = conversion(views, whatsapp);
  const clickable = !!onClick;
  const Tag = (clickable ? "button" : "div") as "button" | "div";

  return (
    <Tag
      {...(clickable ? { type: "button" as const, onClick, "aria-pressed": !!active } : {})}
      className={`card group flex w-full flex-col gap-3 p-4 text-left ${
        active ? "border-primary/40 shadow-card ring-1 ring-primary/15" : "card-hover"
      } ${clickable ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11.5px] font-medium leading-tight text-muted">Taxa de conversão</p>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-ok-50 text-ok">
          <MousePointerClick size={14} />
        </span>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-[30px] font-semibold leading-none tracking-[-0.035em] tabular-nums text-ink">
          {pct}
        </span>
        <span className="text-[16px] font-semibold leading-none text-ink-muted">%</span>
      </div>

      {/* barra de progresso */}
      <div className="mt-auto">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-alt" role="img" aria-label={`Conversão de ${pct}%`}>
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11.5px] leading-tight text-muted">
          {whatsapp} {whatsapp === 1 ? "clique" : "cliques"} em {views} {views === 1 ? "visualização" : "visualizações"}
        </p>
      </div>
    </Tag>
  );
}
