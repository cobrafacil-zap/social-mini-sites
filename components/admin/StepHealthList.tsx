"use client";

import { Check, ChevronRight } from "lucide-react";
import type { Health } from "@/lib/siteHealth";

/**
 * Indicador de conclusão por etapa dentro do editor.
 * Usa exatamente o mesmo cálculo do painel (lib/siteHealth).
 */
export function StepHealthList({
  health, currentKey, onPick,
}: {
  health: Health;
  currentKey: string;
  onPick: (label: string) => void;
}) {
  // ordem fixa = ordem das etapas do editor
  const ORDER = [
    "empresa", "localizacao", "horario", "galeria", "botoes", "whatsapp", "personalizacao",
  ];
  const STEP_LABEL: Record<string, string> = {
    empresa: "Empresa",
    localizacao: "Localização",
    horario: "Horários",
    galeria: "Galeria",
    botoes: "Botões",
    whatsapp: "WhatsApp",
    personalizacao: "Personalização",
  };

  const items = ORDER.map((k) => health.items.find((i) => i.key === k)).filter(Boolean) as Health["items"];

  return (
    <div className="mt-4 rounded-xl border border-line bg-paper p-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[11.5px] font-medium text-ink">Configuração</p>
        <p className="text-[12px] font-semibold tabular-nums text-ink">{health.percent}%</p>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-line" role="img" aria-label={`${health.percent}% configurado`}>
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${health.percent}%` }}
        />
      </div>

      <ul className="mt-2.5 space-y-0.5">
        {items.map((it) => {
          const pct = Math.round(
            (it.points.filter((p) => p.done).length / (it.points.length || 1)) * 100,
          );
          const active = it.key === currentKey;
          return (
            <li key={it.key}>
              <button
                type="button"
                onClick={() => onPick(STEP_LABEL[it.key] ?? it.label)}
                aria-current={active ? "step" : undefined}
                className={`flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[11.5px] transition duration-150 ${
                  active ? "bg-white text-ink" : "text-muted hover:bg-white/60 hover:text-ink-soft"
                }`}
              >
                {it.done ? (
                  <Check size={11} className="shrink-0 text-ok" strokeWidth={3} />
                ) : (
                  <span className="h-[11px] w-[11px] shrink-0 rounded-full border border-dashed border-line-strong" />
                )}
                <span className="min-w-0 flex-1 truncate">{it.label}</span>
                <span className="shrink-0 tabular-nums text-muted">
                  {it.detail ?? `${pct}%`}
                </span>
                <ChevronRight size={10} className="shrink-0 opacity-30" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
