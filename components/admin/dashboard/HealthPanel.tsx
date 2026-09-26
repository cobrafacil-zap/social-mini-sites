"use client";

import Link from "next/link";
import { Check, ChevronRight, SlidersHorizontal } from "lucide-react";
import type { DashSite } from "./types";

export function HealthPanel({ sites }: { sites: DashSite[] }) {
  const rows = sites
    .map((s) => ({ site: s, health: s.health }))
    .sort((a, b) => b.health.percent - a.health.percent);

  const avg = rows.length
    ? Math.round(rows.reduce((acc, r) => acc + r.health.percent, 0) / rows.length)
    : 0;

  if (sites.length === 0) {
    return (
      <section className="panel p-4 sm:p-5" aria-labelledby="config">
        <Head percent={0} avg={0} />
        <Empty />
      </section>
    );
  }

  return (
    <section className="panel p-4 sm:p-5" aria-labelledby="config">
      <Head percent={avg} avg={rows.length} />

      <ul className="mt-4 space-y-1.5">
        {rows.map(({ site, health }) => (
          <li key={site.id}>
            <details className="group rounded-[10px] border border-line bg-white transition duration-150 open:border-line-strong open:bg-paper">
              <summary className="flex cursor-pointer list-none items-center gap-2.5 px-3 py-2.5 [&::-webkit-details-marker]:hidden">
                <ChevronRight
                  size={13}
                  className="shrink-0 text-muted transition duration-200 group-open:rotate-90"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-medium text-ink">{site.name}</span>
                  <span className="mt-0.5 block text-[11px] text-muted">
                    {health.doneCount}/{health.total} etapas completas
                  </span>
                </span>
                <Ring percent={health.percent} />
              </summary>

              <ul className="space-y-1 border-t border-line px-3 py-2.5">
                {health.items.map((it) => (
                  <li key={it.key} className="flex items-center gap-2">
                    <CheckOrX done={it.done} />
                    <span className={`flex-1 text-[12px] ${it.done ? "text-ink-soft" : "text-ink"}`}>
                      {it.label}
                    </span>
                    {it.detail && (
                      <span className="shrink-0 text-[11px] tabular-nums text-muted">{it.detail}</span>
                    )}
                  </li>
                ))}
                <li className="pt-1">
                  <Link
                    href={`/admin/edit/${site.id}`}
                    className="text-[11.5px] font-medium text-primary no-underline hover:underline"
                  >
                    Abrir editor →
                  </Link>
                </li>
              </ul>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Head({ percent, avg }: { percent: number; avg: number }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={15} className="text-primary" />
        <h2 id="config" className="section-title">Configuração do mini site</h2>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-[24px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
          {percent}%
        </span>
        <span className="text-[12px] text-muted">
          configurado {avg > 0 ? `· média de ${avg} ${avg === 1 ? "site" : "sites"}` : ""}
        </span>
      </div>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-paper-alt">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function Ring({ percent }: { percent: number }) {
  const color = percent >= 80 ? "var(--color-ok)" : percent >= 50 ? "var(--color-warn)" : "var(--color-danger)";
  return (
    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
      <svg viewBox="0 0 32 32" className="h-8 w-8 -rotate-90" aria-hidden="true">
        <circle cx="16" cy="16" r="13" fill="none" stroke="var(--color-line)" strokeWidth="3" />
        <circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 13}
          strokeDashoffset={2 * Math.PI * 13 * (1 - percent / 100)}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-[9px] font-semibold tabular-nums text-ink">{percent}</span>
    </span>
  );
}

function CheckOrX({ done }: { done: boolean }) {
  return done ? (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ok-50 text-ok">
      <Check size={10} strokeWidth={3} />
    </span>
  ) : (
    <span className="h-4 w-4 shrink-0 rounded-full border border-dashed border-line-strong" aria-label="Pendente" />
  );
}

function Empty() {
  return (
    <p className="mt-4 rounded-[10px] border border-dashed border-line-strong bg-paper px-4 py-8 text-center text-[12.5px] leading-relaxed text-muted">
      Crie um mini site para acompanhar a configuração campo a campo.
    </p>
  );
}
