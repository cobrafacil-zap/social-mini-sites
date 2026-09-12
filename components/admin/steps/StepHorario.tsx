"use client";

import type { Site, DayKey } from "@/lib/types";
import { DAYS } from "@/lib/hours";
import { Field } from "./Field";

export function StepHorario({ site, set }: { site: Site; set: (p: string, v: unknown) => void }) {
  return (
    <div>
      <h2 style={sectionTitle}>Horário de funcionamento</h2>
      {DAYS.map((d) => {
        const h = site.hours[d.key as DayKey];
        return (
          <div
            key={d.key}
            className="flex items-center gap-2.5 py-2 border-b border-[#EFEEE9]"
          >
            <span className="w-[90px] text-[13.5px] font-medium text-neutral-700">{d.label}</span>
            {!h.closed ? (
              <>
                <input
                  type="time"
                  value={h.open}
                  onChange={(e) => set(`hours.${d.key}.open`, e.target.value)}
                  className="input-base w-[120px]"
                />
                <span className="text-[#8B8B85] text-[12px]">até</span>
                <input
                  type="time"
                  value={h.close}
                  onChange={(e) => set(`hours.${d.key}.close`, e.target.value)}
                  className="input-base w-[120px]"
                />
              </>
            ) : (
              <span className="text-[13px] text-[#8B8B85] flex-1">Fechado</span>
            )}
            <label className="flex items-center gap-1.5 text-[12.5px] text-muted ml-auto">
              <input
                type="checkbox"
                checked={h.closed}
                onChange={(e) => set(`hours.${d.key}.closed`, e.target.checked)}
              /> Fechado
            </label>
          </div>
        );
      })}
    </div>
  );
}

const sectionTitle = { fontSize: 17, fontWeight: 600, color: "#181A17", marginBottom: 18 } as const;