"use client";

import { useEffect, useState } from "react";
import { createSite } from "@/lib/actions/sites";
import { ArrowUpRight, Check, Eye, Sparkles, X } from "lucide-react";
import { MODELS, type LayoutKey, type Model } from "@/lib/models";
import { LayoutPreview } from "./LayoutPreview";

export function TemplatePicker() {
  const [useSeed, setUseSeed] = useState(true);
  const [previewModel, setPreviewModel] = useState<Model | null>(null);

  useEffect(() => {
    if (!previewModel) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewModel(null);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [previewModel]);

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink sm:text-[26px]">
          Escolha um modelo
        </h1>
        <p className="mt-1 max-w-[62ch] text-[13.5px] leading-relaxed text-muted">
          Compare os 8 sites completos antes de escolher. Cada modelo tem estrutura, imagens e estilo próprios.
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

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MODELS.map((model) => (
          <li key={model.id}>
            <article className="card flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card">
              <button
                type="button"
                onClick={() => setPreviewModel(model)}
                className="group relative block w-full overflow-hidden border-0 bg-[#EDEBE4] p-0 text-left"
                aria-label={`Ver o site completo do modelo ${model.label}`}
              >
                <LayoutPreview
                  layout={model.id as LayoutKey}
                  className="h-[260px] w-full border-b border-line sm:h-[285px]"
                />
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-ink shadow-sm transition duration-150 group-hover:bg-white group-hover:text-primary">
                  <Eye size={13} /> Passe o mouse para percorrer · clique para ampliar
                </span>
              </button>

              <div className="flex flex-1 flex-col p-4">
                <p className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
                  {model.label}
                </p>
                <p
                  className="mt-0.5 text-[11.5px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: model.palette.primary }}
                >
                  {model.tagline}
                </p>
                <p className="mt-1.5 text-[12px] leading-snug text-muted">{model.profile}</p>

                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {model.structure.map((section) => (
                    <li
                      key={section}
                      className="rounded-md bg-paper-alt px-2 py-1 text-[10.5px] font-medium text-ink-muted"
                    >
                      {section}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setPreviewModel(model)}
                    className="btn-secondary min-h-10 flex-1"
                  >
                    <Eye size={14} /> Ver completo
                  </button>
                  <form action={createSite} className="flex-1">
                    <input type="hidden" name="template" value={model.template} />
                    <input type="hidden" name="modelId" value={model.seed} />
                    {useSeed && <input type="hidden" name="useSeed" value="on" />}
                    <button type="submit" className="btn-primary min-h-10 w-full">
                      Usar modelo <ArrowUpRight size={14} />
                    </button>
                  </form>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {previewModel && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0D1110]/60 p-2 backdrop-blur-sm sm:p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreviewModel(null);
          }}
        >
          <section
            className="flex h-[calc(100dvh-16px)] max-h-[900px] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl border border-white/30 bg-white shadow-pop sm:h-[calc(100dvh-40px)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="model-preview-title"
          >
            <header className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5">
              <div className="min-w-0 flex-1">
                <h2 id="model-preview-title" className="truncate text-[14px] font-semibold text-ink">
                  {previewModel.label}
                </h2>
                <p className="mt-0.5 text-[11.5px] text-muted">
                  Prévia completa · role para ver todas as seções e imagens
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModel(null)}
                className="icon-btn h-9 w-9"
                aria-label="Fechar prévia"
              >
                <X size={17} />
              </button>
            </header>

            <LayoutPreview
              layout={previewModel.id as LayoutKey}
              variant="full"
              className="min-h-0 flex-1"
            />

            <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-line bg-white p-3 sm:flex-row sm:justify-end sm:px-5">
              <button
                type="button"
                onClick={() => setPreviewModel(null)}
                className="btn-secondary min-h-11"
              >
                Voltar aos modelos
              </button>
              <form action={createSite}>
                <input type="hidden" name="template" value={previewModel.template} />
                <input type="hidden" name="modelId" value={previewModel.seed} />
                {useSeed && <input type="hidden" name="useSeed" value="on" />}
                <button type="submit" className="btn-primary min-h-11 w-full sm:w-auto">
                  <Check size={14} /> Usar este modelo
                </button>
              </form>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
