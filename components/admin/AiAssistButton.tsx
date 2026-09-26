"use client";

import { Sparkles } from "lucide-react";

/**
 * Slot de UI para ações de IA.
 *
 * IMPORTANTE: não existe integração de IA neste projeto. Este componente é
 * apenas a camada visual — quando houver um endpoint real, plugue-o no
 * `onAction` e o botão passa a funcionar. Nada de API fictícia.
 *
 * Campos elegíveis hoje: slogan, descrição curta e história da empresa.
 */
export function AiAssistButton({
  label = "Melhorar com IA",
  hint = "Disponível em breve — a integração de IA ainda não está configurada.",
  className = "",
  onAction,
}: {
  label?: string;
  hint?: string;
  className?: string;
  onAction?: () => void | Promise<void>;
}) {
  return (
    <span className={`tip-wrap inline-flex ${className}`}>
      <button
        type="button"
        disabled={!onAction}
        onClick={() => void onAction?.()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[12px] font-medium text-ink-muted transition duration-150 enabled:hover:border-primary/30 enabled:hover:bg-primary-50 enabled:hover:text-primary disabled:cursor-not-allowed"
      >
        <Sparkles size={13} />
        {label}
      </button>
      {!onAction && (
        <span className="tip" role="tooltip">{hint}</span>
      )}
    </span>
  );
}
