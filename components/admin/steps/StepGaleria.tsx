"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Images, Plus, X, CircleAlert, Link2, Loader2 } from "lucide-react";
import type { Site } from "@/lib/types";
import { StepHeader } from "./Field";

const MAX_BYTES = 4 * 1024 * 1024;

export function StepGaleria({ site, set }: { site: Site; set: (p: string, v: unknown) => void }) {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function addByUrl() {
    if (!url.trim()) return;
    set("gallery", [...site.gallery, { id: `img_${nanoid(6)}`, url: url.trim() }]);
    setUrl("");
  }

  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    if (arr.length === 0) return;

    const tooLarge = arr.filter((f) => f.size > MAX_BYTES);
    const valid = arr.filter((f) => f.size <= MAX_BYTES);

    setErr(tooLarge.length ? `${tooLarge.length} arquivo(s) maior(es) que 4 MB foram ignorados.` : null);
    if (valid.length === 0) return;

    setUploading(true);
    const newGallery = [...site.gallery];
    for (const file of valid) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          setErr(j.error ?? `Falha no upload de ${file.name}`);
        } else {
          const { url: publicUrl } = await res.json();
          newGallery.push({ id: `img_${nanoid(6)}`, url: publicUrl });
        }
      } catch {
        setErr(`Falha no upload de ${file.name}`);
      }
    }
    if (newGallery.length !== site.gallery.length) set("gallery", newGallery);
    setUploading(false);
  }

  function remove(id: string) {
    set("gallery", site.gallery.filter((g) => g.id !== id));
  }

  return (
    <div>
      <StepHeader
        icon={Images}
        title="Galeria de fotos"
        description="Envie várias imagens de uma vez. A galeria aparece como carrossel no celular e grade no computador."
      />

      <div className="rounded-xl border border-line bg-white p-3.5">
        <span className="label">Enviar do computador</span>
        <label
          className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed px-4 py-7 text-center transition duration-150 ${
            uploading
              ? "border-line bg-paper text-muted"
              : "border-line-strong bg-paper hover:border-primary/50 hover:bg-primary-50"
          }`}
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin text-primary" />
          ) : (
            <Images size={20} className="text-ink-muted" />
          )}
          <span className="text-[13px] font-medium text-ink">
            {uploading ? "Enviando imagens…" : "Clique para escolher as fotos"}
          </span>
          <span className="text-[11.5px] text-muted">JPG, PNG ou WebP · até 4 MB por arquivo · múltiplos de uma vez</span>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            className="sr-only"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length) void uploadFiles(files);
              e.currentTarget.value = "";
            }}
          />
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-white p-3.5">
        <span className="label">Adicionar por URL</span>
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Link2 size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="input-base pl-8"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
              onKeyDown={(e) => e.key === "Enter" && addByUrl()}
            />
          </div>
          <button type="button" onClick={addByUrl} className="btn-secondary shrink-0">
            <Plus size={14} /> Adicionar
          </button>
        </div>
      </div>

      {err && (
        <p
          role="alert"
          className="mt-3 flex items-center gap-1.5 rounded-[10px] border border-danger/20 bg-danger-50 px-3 py-2 text-[12.5px] text-danger"
        >
          <CircleAlert size={14} className="shrink-0" /> {err}
        </p>
      )}

      {site.gallery.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-line-strong bg-paper px-4 py-8 text-center text-[12.5px] text-muted">
          Nenhuma foto ainda. Envie imagens para deixar o mini site mais atrativo.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {site.gallery.map((g) => (
            <li key={g.id} className="group relative overflow-hidden rounded-[10px] border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.url} alt="" className="h-[92px] w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(g.id)}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-[#0D1110]/60 text-white opacity-0 backdrop-blur-sm transition duration-150 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-[#0D1110]/80"
                aria-label="Remover foto"
              >
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
