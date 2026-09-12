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

  async function uploadFile(file: File) {
    setErr(null);
    if (file.size > MAX_BYTES) {
      setErr("Arquivo maior que 4 MB.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error ?? "Falha no upload");
      } else {
        const { url: publicUrl } = await res.json();
        set("gallery", [...site.gallery, { id: `img_${nanoid(6)}`, url: publicUrl }]);
      }
    } catch (e) {
      setErr("Falha no upload");
    } finally {
      setUploading(false);
    }
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

      <Field label="Enviar do computador">
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadFile(f);
            e.currentTarget.value = "";
          }}
        />
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