"use client";

import { useRef, useState } from "react";
import { Eraser, Loader2, Check, TriangleAlert } from "lucide-react";
import {
  removeBackground, canRemoveBackground, type RemoveBgResult,
} from "@/lib/removeBackground";

/**
 * Botão "Remover fundo" — processa a imagem no navegador e entrega o PNG
 * já transparente, pronto para o upload normal.
 *
 * Aceita o arquivo local (se o usuário acabou de enviar) OU a URL já
 * cadastrada — assim dá para processar uma imagem que veio do Supabase sem
 * o usuário precisar escolher o arquivo de novo.
 */
export function RemoveBackgroundButton({
  file,
  url,
  onDone,
  label = "Remover fundo",
  compact = false,
}: {
  file?: File | null;
  url?: string;
  onDone: (result: RemoveBgResult) => void;
  label?: string;
  compact?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [tolerance, setTolerance] = useState(32);
  const inputRef = useRef<HTMLInputElement>(null);

  const ready = !!(file || url);

  async function run(f: File, tol: number) {
    setBusy(true);
    setError(null);
    setDone(null);
    try {
      const result = await removeBackground(f, { tolerance: tol, trim: true });
      onDone(result);
      setDone(result.removedPercent);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao remover o fundo.");
    } finally {
      setBusy(false);
    }
  }

  /** Sem arquivo local, baixa a imagem que já está cadastrada. */
  async function runFromUrl(target: string) {
    setBusy(true);
    setError(null);
    setDone(null);
    try {
      const res = await fetch(target, { mode: "cors" });
      if (!res.ok) throw new Error("Não consegui baixar a imagem cadastrada.");
      const blob = await res.blob();
      const name = (target.split("/").pop() || "imagem").split("?")[0] || "imagem.png";
      await run(new File([blob], name, { type: blob.type || "image/png" }), tolerance);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao baixar a imagem.");
      setBusy(false);
    }
  }

  function handlePick(next: File) {
    if (!canRemoveBackground(next)) {
      setError("Formato não suportado. Envie PNG, JPG ou WebP.");
      return;
    }
    void run(next, tolerance);
  }

  function activate() {
    if (file) void run(file, tolerance);
    else if (url) void runFromUrl(url);
    else inputRef.current?.click();
  }

  return (
    <div className="mt-2">
      {compact ? (
        <span className="tip-wrap inline-flex">
          <button
            type="button"
            onClick={activate}
            disabled={busy || !ready}
            className="flex items-center gap-1.5 rounded-[9px] border border-dashed border-line-strong bg-paper px-2.5 py-1.5 text-[11.5px] font-medium text-ink-soft transition duration-150 enabled:hover:border-primary/50 enabled:hover:bg-primary-50 enabled:hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? <Loader2 size={12} className="animate-spin" /> : <Eraser size={12} />}
            {busy ? "Processando…" : label}
          </button>
          <span className="tip" role="tooltip">
            Remove o fundo liso da imagem no navegador
          </span>
        </span>
      ) : (
        <div className="rounded-[10px] border border-line bg-paper p-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[12px] font-medium text-ink-soft">
              <Eraser size={13} className="text-primary" />
              Remover fundo
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="text-[11px] font-medium text-primary transition duration-150 hover:underline"
            >
              {open ? "Ocultar ajuste" : "Ajustar"}
            </button>
          </div>

          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            Processa a imagem aqui no navegador e envia o PNG transparente.
          </p>

          {open && (
            <label className="mt-2.5 block">
              <span className="flex items-center justify-between text-[11px] text-muted">
                Tolerância
                <span className="tabular-nums">{tolerance}</span>
              </span>
              <input
                type="range"
                min={4}
                max={80}
                value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="mt-1 h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-[#145C4B]"
                aria-label="Tolerância da remoção de fundo"
              />
              <span className="mt-1 block text-[10.5px] leading-snug text-muted">
                Aumente se sobrar fundo. Diminua se o conteúdo estiver sumindo.
              </span>
            </label>
          )}

          <div className="mt-2.5 grid gap-1.5">
            <button
              type="button"
              onClick={activate}
              disabled={busy || !ready}
              className="flex w-full items-center justify-center gap-1.5 rounded-[9px] border border-primary/30 bg-white px-3 py-2 text-[12.5px] font-medium text-primary transition duration-150 enabled:hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? <Loader2 size={13} className="animate-spin" /> : <Eraser size={13} />}
              {busy ? "Removendo fundo…" : file || url ? "Processar imagem atual" : "Escolher imagem"}
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="flex w-full items-center justify-center gap-1.5 rounded-[9px] border border-dashed border-line-strong bg-white px-3 py-2 text-[12px] font-medium text-ink-muted transition duration-150 enabled:hover:border-primary/40 enabled:hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ou escolher outro arquivo
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handlePick(f);
              e.currentTarget.value = "";
            }}
          />

          {error && (
            <p className="mt-2 flex items-start gap-1.5 text-[11.5px] leading-snug text-danger" role="alert">
              <TriangleAlert size={12} className="mt-px shrink-0" />
              {error}
            </p>
          )}

          {done !== null && !error && (
            <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-ok" role="status">
              <Check size={12} /> {done}% da imagem ficou transparente.
            </p>
          )}
        </div>
      )}
    </div>
  );
}