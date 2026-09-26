"use client";

import { Check, Palette, Sparkles } from "lucide-react";
import type { Site, ButtonStyle, Customization } from "@/lib/types";
import { radiusFor } from "@/lib/templates";
import { Field, StepHeader } from "./Field";

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

  function colorField(label: string, key: keyof typeof c) {
    const value = c[key] as string;
    return (
      <Field label={label}>
        <div className="flex items-center gap-2">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px] border border-line">
            <input
              type="color"
              value={value}
              onChange={(e) => set(`customization.${key}`, e.target.value)}
              aria-label={`${label} (seletor de cor)`}
              className="absolute -left-2 -top-2 h-14 w-14 cursor-pointer border-0 p-0"
            />
          </span>
          <input
            className="input-base font-mono text-[12.5px] uppercase"
            value={value}
            onChange={(e) => set(`customization.${key}`, e.target.value)}
            aria-label={`${label} (código hexadecimal)`}
          />
        </div>
      </Field>
    );
  }

  return (
    <div>
      <StepHeader
        icon={Palette}
        title="Personalização visual"
        description="Cores e estilo dos botões. As sugestões já vêm escolhidas para o segmento do cliente."
      />

      <div className="rounded-xl border border-line bg-paper p-3.5">
        <div className="mb-2.5 flex items-start gap-2">
          <Sparkles size={14} className="mt-0.5 shrink-0 text-primary" />
          <div>
            <p className="text-[12.5px] font-medium text-ink">{sugg.label}</p>
            <p className="text-[11.5px] text-muted">
              Baseado em {site.company.category || site.template}. Clique para aplicar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {sugg.palettes.map((p, i) => {
            const active = p.primary === c.primary && p.secondary === c.secondary && p.background === c.background;
            return (
              <button
                key={i}
                type="button"
                onClick={() => set("customization", p)}
                className={`flex flex-col gap-2 rounded-[10px] border p-2.5 text-left transition duration-150 active:scale-[0.98] ${
                  active
                    ? "border-primary bg-white shadow-xs"
                    : "border-line bg-white hover:border-line-strong hover:shadow-xs"
                }`}
              >
                <span className="flex gap-1">
                  {[p.primary, p.secondary, p.background, p.text].map((col, j) => (
                    <span key={j} className="h-5 w-5 rounded-full border border-black/10" style={{ background: col }} />
                  ))}
                </span>
                <span className="flex items-center justify-between gap-1">
                  <span className="font-mono text-[10.5px] uppercase text-ink-soft">{p.primary}</span>
                  {active && <Check size={12} className="shrink-0 text-primary" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {colorField("Cor principal", "primary")}
        {colorField("Cor secundária", "secondary")}
        {colorField("Cor do fundo", "background")}
        {colorField("Cor dos textos", "text")}
      </div>

      <div className="mt-5">
        <span className="label">Estilo dos botões</span>
        <div className="grid grid-cols-3 gap-2">
          {(["rounded", "pill", "square"] as ButtonStyle[]).map((s) => {
            const isActive = c.buttonStyle === s;
            const r = radiusFor(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => set("customization.buttonStyle", s)}
                className="flex flex-col items-center gap-2 rounded-[10px] border px-3 py-3 transition duration-150 active:scale-[0.98]"
                style={{
                  borderRadius: 12,
                  borderColor: isActive ? c.primary : "var(--line)",
                  background: isActive ? `${c.primary}0A` : "#fff",
                  boxShadow: isActive ? `0 0 0 3px ${c.primary}1A` : undefined,
                }}
              >
                <span
                  className="h-6 w-full"
                  style={{ background: c.primary, borderRadius: r > 20 ? 999 : r }}
                />
                <span
                  className="text-[11.5px] font-medium"
                  style={{ color: isActive ? c.primary : "var(--text-muted)" }}
                >
                  {s === "rounded" ? "Arredondado" : s === "pill" ? "Pílula" : "Quadrado"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p
        className={`mt-5 flex items-center gap-1.5 rounded-[10px] border px-3 py-2.5 text-[12.5px] ${
          saved ? "border-ok/20 bg-ok-50 text-ok" : "border-line bg-paper text-muted"
        }`}
        aria-live="polite"
      >
        <Check size={14} className="shrink-0" />
        {saved
          ? "Todas as alterações estão salvas. Clique em Salvar alterações para garantir."
          : "Salvando alterações…"}
      </p>
    </div>
  );
}
