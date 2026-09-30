"use client";

import { useState } from "react";
import { createSite } from "@/lib/actions/sites";
import { Sparkles, Check } from "lucide-react";
import { MODELS, type LayoutKey } from "@/lib/models";
import { LayoutPreview } from "./LayoutPreview";

export function TemplatePicker() {
  const [useSeed, setUseSeed] = useState(true);

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink sm:text-[26px]">
          Escolha um modelo
        </h1>
        <p className="mt-1 max-w-[62ch] text-[13.5px] leading-relaxed text-muted">
          São 8 modelos com estruturas diferentes — cada um desenhado para um tipo de negócio.
          A miniatura abaixo é o layout real, renderizado com os dados do segmento.
        </p>
      </header>

      <label className="mb-5 flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-3 transition duration-150 hover:border-line-strong">
        <input
          type="checkbox"
          checked={useSeed}
          onChange={(e) => setUseSeed(e.target.checked)}
          className="cursor-pointer"
        />
        <Sparkles size={14} className="shrink-0 text-primary" />
        <span className="text-[13px] text-ink-soft">
          Preencher com <strong className="font-semibold text-ink">exemplo completo</strong> do segmento
          <span className="block text-[11.5px] text-muted">
            Capa, galeria, horários e botões já vêm prontos para você editar.
          </span>
        </span>
      </label>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MODELS.map((m) => (
          <li key={m.id}>
            <form action={createSite} className="h-full">
              <input type="hidden" name="template" value={m.template} />
              <input type="hidden" name="modelId" value={m.seed} />
              {useSeed && <input type="hidden" name="useSeed" value="on" />}

              <button
                type="submit"
                className="card card-hover group flex h-full w-full flex-col overflow-hidden text-left active:scale-[0.99]"
              >
                {/* miniatura real do layout */}
                <LayoutPreview layout={m.id as LayoutKey} className="h-[230px] w-full border-b border-line" />

                <div className="flex flex-1 flex-col p-3.5">
                  <p className="text-[13px] font-semibold tracking-[-0.01em] text-ink transition-colors duration-150 group-hover:text-primary">
                    {m.label}
                  </p>
                  <p className="mt-0.5 text-[11.5px] font-medium uppercase tracking-[0.08em]" style={{ color: m.palette.primary }}>
                    {m.tagline}
                  </p>
                  <p className="mt-1.5 text-[11.5px] leading-snug text-muted">{m.profile}</p>

                  <ul className="mt-2.5 flex flex-wrap gap-1">
                    {m.structure.map((s) => (
                      <li
                        key={s}
                        className="rounded-md bg-paper-alt px-1.5 py-0.5 text-[10px] font-medium text-ink-muted"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-3 flex items-center gap-1 text-[11.5px] font-semibold text-primary opacity-0 transition duration-150 group-hover:opacity-100">
                    <Check size={12} /> Usar este modelo
                  </span>
                </div>
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}