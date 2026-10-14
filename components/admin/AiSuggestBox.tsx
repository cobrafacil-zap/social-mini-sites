"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import type { TextSuggestion } from "@/lib/assistant";

/**
 * Botão de sugestões automáticas do editor.
 *
 * Abre um painel com opções geradas a partir dos dados do site — nada é
 * aplicado sem o clique em "Usar". Quando faltam dados, explica o que
 * preencher em vez de mostrar opções vazias.
 */
export function AiSuggestBox({
  label,
  hint = "Geradas a partir dos dados do site, aqui no navegador.",
  getOptions,
  missingHint = "Preencha nome, categoria e cidade para gerar sugestões.",
  onApply,
  className = "",
}: {
  label: string;
  hint?: string;
  getOptions: () => TextSuggestion[];
  missingHint?: string;
  onApply: (text: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<TextSuggestion[] | null>(null);
  const [applied, setApplied] = useState<number | null>(null);

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    setOptions(getOptions());
    setApplied(null);
    setOpen(true);
  }

  return (
    <div className={className}>
      <span className="tip-wrap inline-flex">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[12px] font-medium text-ink-muted transition duration-150 hover:border-primary/30 hover:bg-primary-50 hover:text-primary"
        >
          <Sparkles size={13} />
          {label}
        </button>
        <span className="tip" role="tooltip">{hint}</span>
      </span>

      {open && (
        <div className="mt-2 animate-slideDown rounded-[10px] border border-line bg-paper p-2.5">
          {options && options.length > 0 ? (
            <ul className="space-y-1.5">
              {options.map((o, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-line bg-white p-2.5 transition duration-150 hover:border-primary/30"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] leading-relaxed text-ink">{o.text}</p>
                    <p className="mt-1 text-[11px] leading-snug text-muted">{o.note}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onApply(o.text);
                      setApplied(i);
                    }}
                    className="btn-secondary btn-sm shrink-0"
                  >
                    {applied === i ? (
                      <><Check size={12} /> Usado</>
                    ) : (
                      "Usar"
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-1 py-1.5 text-[12px] leading-relaxed text-muted">
              {missingHint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
