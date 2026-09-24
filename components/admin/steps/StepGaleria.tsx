"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Plus, X } from "lucide-react";
import type { Site } from "@/lib/types";
import { Field } from "./Field";

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
    if (tooLarge.length) { setErr(`${tooLarge.length} arquivo(s) maior(es) que 4 MB foram ignorados.`); }
    const valid = arr.filter((f) => f.size <= MAX_BYTES);
    if (valid.length === 0) return;
    if (!tooLarge.length) setErr(null);
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
      <h2 style={sectionTitle}>Galeria de fotos</h2>

      <Field label="Adicionar por URL">
        <div className="flex gap-2">
          <input
            className="input-base"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Cole a URL de uma imagem"
            onKeyDown={(e) => e.key === "Enter" && addByUrl()}
          />
          <button
            type="button"
            onClick={addByUrl}
            className="flex items-center gap-1 bg-primary text-white border border-primary rounded-lg py-2 px-3 text-[13px] font-semibold cursor-pointer"
          >
            <Plus size={14} /> Adicionar
          </button>
        </div>
      </Field>

      <Field label="Enviar do computador (pode selecionar várias)">
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length) uploadFiles(files);
            e.currentTarget.value = "";
          }}
        />
        {uploading && <span className="text-[12px] text-muted">Enviando {`...`}</span>}
      </Field>

      {err && <p className="text-danger text-[12.5px] mb-2">{err}</p>}

      <div className="grid grid-cols-3 gap-2.5">
        {site.gallery.map((g) => (
          <div key={g.id} className="relative">
            <img src={g.url} alt="" className="w-full h-[100px] object-cover rounded-[10px]" />
            <button
              type="button"
              onClick={() => remove(g.id)}
              className="absolute top-1 right-1 bg-black/60 border-0 rounded-full w-[22px] h-[22px] text-white cursor-pointer flex items-center justify-center"
              aria-label="Remover"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {site.gallery.length === 0 && (
        <p className="text-[13px] text-[#8B8B85]">Nenhuma foto adicionada ainda.</p>
      )}
    </div>
  );
}

const sectionTitle = { fontSize: 17, fontWeight: 600, color: "#181A17", marginBottom: 18 } as const;