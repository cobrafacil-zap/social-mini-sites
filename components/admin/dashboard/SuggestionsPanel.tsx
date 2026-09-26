"use client";

import Link from "next/link";
import { Sparkles, CircleCheck, CircleAlert, Info, ArrowRight } from "lucide-react";
import type { Suggestion } from "@/lib/siteHealth";

const SEV: Record<
  Suggestion["severity"],
  { cls: string; dot: string; label: string; Icon: typeof Info }
> = {
  high: { cls: "text-danger", dot: "bg-[#F04438]", label: "Prioritário", Icon: CircleAlert },
  mid: { cls: "text-warn", dot: "bg-[#F79009]", label: "Importante", Icon: Info },
  low: { cls: "text-ink-muted", dot: "bg-[#C8CFCC]", label: "Bônus", Icon: Info },
};

export function SuggestionsPanel({
  suggestions, limit = 6,
}: { suggestions: Suggestion[]; limit?: number }) {
  const top = suggestions.slice(0, limit);
  const rest = suggestions.length - top.length;

  return (
    <section className="panel p-4 sm:p-5" aria-labelledby="sugestoes">
      <div className="flex items-center gap-2">
        <Sparkles size={15} className="text-primary" />
        <h2 id="sugestoes" className="section-title">Melhore seus mini sites</h2>
      </div>
      <p className="mt-1 text-[12px] text-muted">
        {suggestions.length === 0
          ? "Baseado nos campos que ainda estão vazios."
          : `${suggestions.length} ${suggestions.length === 1 ? "pendência" : "pendências"} reais nos seus sites.`}
      </p>

      {top.length === 0 ? (
        <p className="mt-4 flex items-start gap-2 rounded-[10px] border border-ok/20 bg-ok-50 px-3.5 py-5 text-[12.5px] leading-relaxed text-ok">
          <CircleCheck size={15} className="mt-px shrink-0" />
          <span>
            <strong className="font-semibold">Tudo certo!</strong> Nenhum campo obrigatório ficou de fora.
            Continue acompanhando os acessos.
          </span>
        </p>
      ) : (
        <ul className="mt-3.5 space-y-1.5">
          {top.map((s) => {
            const sev = SEV[s.severity];
            return (
              <li key={s.id}>
                <Link
                  href={`/admin/edit/${s.siteId}`}
                  className="group flex items-start gap-2.5 rounded-[10px] border border-line bg-white px-3 py-2.5 no-underline transition duration-150 hover:border-line-strong hover:bg-paper"
                >
                  <sev.Icon size={14} className={`mt-0.5 shrink-0 ${sev.cls}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] leading-snug text-ink">{s.message}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
                      <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} aria-hidden="true" />
                      {s.siteName}
                      <span className="text-line-strong">·</span>
                      {sev.label}
                    </span>
                  </span>
                  <ArrowRight
                    size={13}
                    className="mt-0.5 shrink-0 text-muted opacity-0 transition duration-150 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {rest > 0 && (
        <p className="mt-3 text-[11.5px] text-muted">
          +{rest} outra{rest === 1 ? "" : "s"} {rest === 1 ? "pendência" : "pendências"} —{" "}
          <Link href="#sugestoes" className="font-medium text-primary no-underline hover:underline">
            abrir editor
          </Link>{" "}
          para resolver.
        </p>
      )}
    </section>
  );
}
