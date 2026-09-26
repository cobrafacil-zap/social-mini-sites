"use client";

import { Clock } from "lucide-react";
import type { Site, DayKey } from "@/lib/types";
import { DAYS } from "@/lib/hours";
import { StepHeader } from "./Field";

export function StepHorario({ site, set }: { site: Site; set: (p: string, v: unknown) => void }) {
  return (
    <div>
      <StepHeader
        icon={Clock}
        title="Horários de funcionamento"
        description="O mini site mostra um selo 'Aberto agora' / 'Fechado agora' calculado a partir destes horários."
      />

      <div className="overflow-hidden rounded-xl border border-line">
        {DAYS.map((d, i) => {
          const h = site.hours[d.key as DayKey];
          return (
            <div
              key={d.key}
              className={`flex flex-wrap items-center gap-x-3 gap-y-2 px-3.5 py-2.5 transition-colors duration-150 ${
                i === 0 ? "" : "border-t border-line"
              } ${h.closed ? "bg-paper" : "bg-white"}`}
            >
              <span className="w-[76px] shrink-0 text-[13px] font-medium text-ink-soft">{d.label}</span>

              {!h.closed ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="time"
                    aria-label={`Abertura ${d.label}`}
                    value={h.open}
                    onChange={(e) => set(`hours.${d.key}.open`, e.target.value)}
                    className="input-base w-[124px] py-1.5"
                  />
                  <span className="text-[12px] text-muted">até</span>
                  <input
                    type="time"
                    aria-label={`Fechamento ${d.label}`}
                    value={h.close}
                    onChange={(e) => set(`hours.${d.key}.close`, e.target.value)}
                    className="input-base w-[124px] py-1.5"
                  />
                </div>
              ) : (
                <span className="flex-1 text-[12.5px] text-muted">Fechado o dia todo</span>
              )}

              <label className="ml-auto flex cursor-pointer items-center gap-2 text-[12.5px] text-ink-soft select-none">
                <input
                  type="checkbox"
                  checked={h.closed}
                  onChange={(e) => set(`hours.${d.key}.closed`, e.target.checked)}
                />
                Fechado
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
