"use client";

import type { Site, ButtonStyle, Customization } from "@/lib/types";
import { radiusFor } from "@/lib/templates";
import { Field } from "./Field";

type Props = { site: Site; set: (p: string, v: unknown) => void; onSave?: () => Promise<unknown>; saved?: boolean };

const SUGGESTIONS: Record<string, { label: string; palettes: Customization[] }> = {
  pizzaria: {
    label: "Sugestões para Pizzaria / Restaurante",
    palettes: [
      { primary: "#9B1B30", secondary: "#E9C46A", background: "#FFF8F0", text: "#1A1A1A", buttonStyle: "rounded" },
      { primary: "#145C4B", secondary: "#D9A441", background: "#FFFFFF", text: "#1A1A1A", buttonStyle: "rounded" },
      { primary: "#1F2A44", secondary: "#C0392B", background: "#F7F3EE", text: "#1A1A1A", buttonStyle: "pill" },
      { primary: "#3D2C1E", secondary: "#E67E22", background: "#FFFBF5", text: "#2B1A0E", buttonStyle: "rounded" },
    ],
  },
  loja: {
    label: "Sugestões para Loja",
    palettes: [
      { primary: "#111111", secondary: "#E6007E", background: "#FFFFFF", text: "#111111", buttonStyle: "square" },
      { primary: "#0F766E", secondary: "#F59E0B", background: "#FFFFFF", text: "#0F172A", buttonStyle: "pill" },
      { primary: "#7C3AED", secondary: "#06B6D4", background: "#F8F5FF", text: "#1E1B2E", buttonStyle: "rounded" },
      { primary: "#1E293B", secondary: "#EAB308", background: "#FFFFFF", text: "#1E293B", buttonStyle: "rounded" },
    ],
  },
  servicos: {
    label: "Sugestões para Serviços",
    palettes: [
      { primary: "#0E3A5D", secondary: "#1EA956", background: "#FFFFFF", text: "#0E1E2F", buttonStyle: "rounded" },
      { primary: "#1A1A1A", secondary: "#F59E0B", background: "#F9F9F7", text: "#1A1A1A", buttonStyle: "pill" },
      { primary: "#145C4B", secondary: "#2DD4BF", background: "#FFFFFF", text: "#0F172A", buttonStyle: "rounded" },
    ],
  },
  profissional: {
    label: "Sugestões para Profissional",
    palettes: [
      { primary: "#2B2D42", secondary: "#8D99AE", background: "#FFFFFF", text: "#2B2D42", buttonStyle: "pill" },
      { primary: "#6B21A8", secondary: "#F59E0B", background: "#FFFBFF", text: "#1A1A1A", buttonStyle: "rounded" },
      { primary: "#0F2A44", secondary: "#D9A441", background: "#F8F6F1", text: "#0F172A", buttonStyle: "rounded" },
    ],
  },
  default: {
    label: "Sugestões visuais",
    palettes: [
      { primary: "#145C4B", secondary: "#D9A441", background: "#FFFFFF", text: "#1A1A1A", buttonStyle: "rounded" },
      { primary: "#9B1B30", secondary: "#E9C46A", background: "#FFF8F0", text: "#1A1A1A", buttonStyle: "rounded" },
      { primary: "#1E293B", secondary: "#06B6D4", background: "#FFFFFF", text: "#1E293B", buttonStyle: "pill" },
      { primary: "#111111", secondary: "#E6007E", background: "#FFFFFF", text: "#111111", buttonStyle: "square" },
    ],
  },
};

function pickSuggestions(site: Site) {
  const cat = (site.company.category || "").toLowerCase();
  const tpl = site.template;
  if (cat.includes("pizza") || cat.includes("restaurante") || cat.includes("lanch") || cat.includes("bar") || tpl === "restaurante") return SUGGESTIONS.pizzaria!;
  if (cat.includes("loja") || cat.includes("moda") || cat.includes("roupa") || tpl === "loja") return SUGGESTIONS.loja!;
  if (tpl === "servicos") return SUGGESTIONS.servicos!;
  if (tpl === "profissional") return SUGGESTIONS.profissional!;
  return SUGGESTIONS.default!;
}

export function StepEstilo({ site, set, saved }: Props) {
  const c = site.customization;
  const sugg = pickSuggestions(site);

  function applyPalette(p: Customization) {
    set("customization", p);
  }

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

      <div className="rounded-xl border border-[#E7E6E1] bg-[#FAFAF7] p-3.5 mb-4">
        <p className="text-[13px] font-semibold text-ink mb-1">{sugg.label}</p>
        <p className="text-[12.5px] text-muted mb-2.5">Clique para aplicar — baseado em {site.company.category || site.template}</p>
        <div className="grid grid-cols-2 gap-2">
          {sugg.palettes.map((p, i) => {
            const active = p.primary === c.primary && p.secondary === c.secondary && p.background === c.background;
            return (
              <button
                key={i}
                type="button"
                onClick={() => applyPalette(p)}
                className={`text-left rounded-lg border p-2.5 flex flex-col gap-2 ${active ? "border-primary bg-white" : "border-line bg-white hover:border-[#DDDBD4]"}`}
              >
                <span className="flex gap-1">
                  <span className="w-6 h-6 rounded-full border border-black/10" style={{ background: p.primary }} />
                  <span className="w-6 h-6 rounded-full border border-black/10" style={{ background: p.secondary }} />
                  <span className="w-6 h-6 rounded-full border border-black/10" style={{ background: p.background }} />
                  <span className="w-6 h-6 rounded-full border border-black/10" style={{ background: p.text }} />
                </span>
                <span className="text-[12px] font-medium text-ink">{p.primary} · {p.buttonStyle}</span>
                {active && <span className="text-[11px] text-ok font-medium">Aplicada</span>}
              </button>
            );
          })}
        </div>
      </div>

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

      <div className="mt-4 rounded-lg border border-primary/20 bg-[#EAF1EE] px-3 py-2.5">
        <p className="text-[12.5px] text-ink">
          {saved ? "✓ Todas as alterações estão salvas (autosave)." : "Salvando..."}
          {" "}Na última etapa clique em <b>Salvar alterações</b> para garantir que tudo foi gravado antes de publicar.
        </p>
      </div>
    </div>
  );
}

const sectionTitle = { fontSize: 17, fontWeight: 600, color: "#181A17", marginBottom: 18 } as const;