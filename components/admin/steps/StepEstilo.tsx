"use client";

import type { Site, ButtonStyle } from "@/lib/types";
import { radiusFor } from "@/lib/templates";
import { Field } from "./Field";

export function StepEstilo({ site, set }: { site: Site; set: (p: string, v: unknown) => void }) {
  const c = site.customization;

  function colorField(label: string, key: keyof typeof c) {
    return (
      <Field label={label}>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={c[key] as string}
            onChange={(e) => set(`customization.${key}`, e.target.value)}
            className="w-[42px] h-9 border border-[#DDDBD4] rounded-lg p-0.5"
          />
          <input
            className="input-base"
            value={c[key] as string}
            onChange={(e) => set(`customization.${key}`, e.target.value)}
          />
        </div>
      </Field>
    );
  }

  return (
    <div>
      <h2 style={sectionTitle}>Personalização visual</h2>
      <div className="grid grid-cols-2 gap-3">
        {colorField("Cor principal", "primary")}
        {colorField("Cor secundária", "secondary")}
        {colorField("Cor do fundo", "background")}
        {colorField("Cor dos textos", "text")}
      </div>
      <Field label="Estilo dos botões">
        <div className="flex gap-2">
          {(["rounded", "pill", "square"] as ButtonStyle[]).map((s) => {
            const isActive = c.buttonStyle === s;
            const r = radiusFor(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => set("customization.buttonStyle", s)}
                className="flex-1 py-2.5 text-[13px] cursor-pointer"
                style={{
                  borderRadius: r > 20 ? 999 : r,
                  border: isActive ? "2px solid #145C4B" : "1px solid #DDDBD4",
                  background: isActive ? "#EAF1EE" : "#fff",
                }}
              >
                {s === "rounded" ? "Arredondado" : s === "pill" ? "Pílula" : "Quadrado"}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

const sectionTitle = { fontSize: 17, fontWeight: 600, color: "#181A17", marginBottom: 18 } as const;