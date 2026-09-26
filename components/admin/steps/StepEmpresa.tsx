"use client";

import { useState } from "react";
import { Building2, CircleAlert } from "lucide-react";
import type { Site } from "@/lib/types";
import { slugify, isValidSlug } from "@/lib/slugify";
import { Field, StepHeader, Section } from "./Field";

const MAX_BYTES = 4 * 1024 * 1024;

const CATEGORIAS = [
  "Restaurante", "Lanchonete", "Pizzaria", "Hamburgueria", "Bar / Pub", "Cafeteria",
  "Padaria", "Confeitaria", "Sorveteria / Açaí", "Loja de Roupas", "Loja de Calçados",
  "Loja de Moda Feminina", "Loja de Moda Masculina", "Loja Infantil", "Cosméticos / Maquiagem",
  "Salão de Beleza", "Barbearia", "Estética / Spa", "Academia / Fitness", "Clínica / Consultório",
  "Odontologia", "Farmácia", "Pet Shop", "Mercado / Supermercado", "Floricultura", "Oficina / Auto",
  "Imobiliária", "Advocacia", "Contabilidade", "Arquitetura / Engenharia", "Educação / Escola",
  "Tecnologia / Informática", "Marketing / Design", "Prestador de Serviços",
  "Profissional Autônomo", "Outros",
];

export function StepEmpresa({ site, set }: { site: Site; set: (p: string, v: unknown) => void }) {
  const c = site.company;
  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "smdigtal.com").toLowerCase();
  const touched = (site as unknown as { slugTouched?: boolean }).slugTouched === true;
  const [err, setErr] = useState<string | null>(null);

  async function upload(file: File, field: "logoUrl" | "coverUrl") {
    setErr(null);
    if (file.size > MAX_BYTES) {
      setErr("Arquivo maior que 4 MB. Envie uma imagem menor.");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error ?? "Falha no upload");
        return;
      }
      const { url } = await res.json();
      set(`company.${field}`, url);
    } catch {
      setErr("Falha no upload. Verifique sua conexão.");
    }
  }

  return (
    <div>
      <StepHeader
        icon={Building2}
        title="Informações da empresa"
        description="O que o cliente vê primeiro no mini site: nome, categoria, slogan e as descrições."
      />

      <Field label="Nome da empresa">
        <input
          className="input-base"
          value={c.name}
          onChange={(e) => {
            const v = e.target.value;
            set("company.name", v);
            if (!touched) set("slug", slugify(v) || site.slug);
          }}
          placeholder="Villa Itália"
        />
      </Field>

      <Field
        label="Slug / URL"
        hint={
          site.slug && !isValidSlug(site.slug)
            ? "Use apenas letras minúsculas, números e hífens."
            : `O site ficará em ${site.slug || "seu-slug"}.${root}`
        }
      >
        <div className="flex items-center rounded-[10px] border border-line bg-white transition duration-150 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/[0.07] hover:border-line-strong">
          <input
            className="min-w-0 flex-1 rounded-l-[10px] bg-transparent px-3 py-2 text-[13.5px] text-ink outline-none placeholder:text-[#A8AFA9]"
            value={site.slug}
            onChange={(e) => {
              set("slugTouched", true);
              set("slug", slugify(e.target.value));
            }}
            placeholder="villa-italia"
          />
          <span className="shrink-0 select-none border-l border-line bg-paper px-2.5 py-2 text-[12.5px] text-muted">
            .{root}
          </span>
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Categoria">
          <select
            className="input-base"
            value={CATEGORIAS.includes(c.category) ? c.category : c.category ? "Outros" : ""}
            onChange={(e) => set("company.category", e.target.value)}
          >
            <option value="" disabled>Selecione a categoria</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {c.category && !CATEGORIAS.includes(c.category) && (
            <input
              className="input-base mt-2"
              value={c.category}
              onChange={(e) => set("company.category", e.target.value)}
              placeholder="Digite a categoria"
            />
          )}
        </Field>

        <Field label="Slogan">
          <input
            className="input-base"
            value={c.slogan}
            onChange={(e) => set("company.slogan", e.target.value)}
            placeholder="Sabor autêntico da Itália"
          />
        </Field>
      </div>

      <Field label="Descrição curta" hint="Aparece logo abaixo do nome. Ideal para SEO e compartilhamento.">
        <textarea
          className="input-base"
          rows={2}
          value={c.shortDesc}
          onChange={(e) => set("company.shortDesc", e.target.value)}
          placeholder="Pizzas, porções e sabores especiais para compartilhar bons momentos."
        />
      </Field>

      <Field label="História da empresa" hint="Bloco 'Sobre nós' do mini site.">
        <textarea
          className="input-base"
          rows={4}
          value={c.history}
          onChange={(e) => set("company.history", e.target.value)}
        />
      </Field>

      <Section title="Imagens">
        {err && (
          <p className="mb-3 flex items-center gap-1.5 rounded-[10px] border border-danger/20 bg-danger-50 px-3 py-2 text-[12.5px] text-danger" role="alert">
            <CircleAlert size={14} className="shrink-0" /> {err}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageField
            label="Logo da empresa"
            value={c.logoUrl}
            preview={<LogoPreview url={c.logoUrl} />}
            onChange={(v) => set("company.logoUrl", v)}
            onUpload={(f) => void upload(f, "logoUrl")}
            hint="Quadrada. Aparece sobre a capa."
            previewClass="h-16 w-16"
          />
          <ImageField
            label="Foto de capa"
            value={c.coverUrl}
            coverPosition={c.coverPosition}
            onChange={(v) => set("company.coverUrl", v)}
            onUpload={(f) => void upload(f, "coverUrl")}
            onCoverPosition={(v) => set("company.coverPosition", v)}
            hint="Horizontal, 1600px ou mais."
            previewClass="h-20 w-full"
          />
        </div>
      </Section>

      <Section title="Contato e redes">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefone">
            <input className="input-base" value={c.phone} onChange={(e) => set("company.phone", e.target.value)} placeholder="(43) 3000-0000" />
          </Field>
          <Field label="E-mail">
            <input className="input-base" type="email" value={c.email} onChange={(e) => set("company.email", e.target.value)} placeholder="contato@empresa.com" />
          </Field>
          <Field label="Instagram" hint="Só o usuário, sem @.">
            <input className="input-base" value={c.instagram} onChange={(e) => set("company.instagram", e.target.value)} placeholder="@empresa" />
          </Field>
          <Field label="Facebook">
            <input className="input-base" value={c.facebook} onChange={(e) => set("company.facebook", e.target.value)} placeholder="facebook.com/empresa" />
          </Field>
        </div>
        <Field label="Site">
          <input className="input-base" value={c.website} onChange={(e) => set("company.website", e.target.value)} placeholder="www.empresa.com" />
        </Field>
      </Section>
    </div>
  );
}

/* ============================ Blocos ============================ */

function ImageField({
  label, value, onChange, onUpload, hint, preview, previewClass, coverPosition, onCoverPosition,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onUpload: (f: File) => void;
  hint?: string;
  preview: React.ReactNode;
  previewClass: string;
  coverPosition?: string;
  onCoverPosition?: (v: string) => void;
}) {
  return (
    <div>
      <span className="label">{label}</span>

      <div className="overflow-hidden rounded-[10px] border border-line bg-paper">
        <div className={`flex items-center justify-center border-b border-line ${previewClass}`}>
          {preview}
        </div>
        <div className="space-y-2 bg-white p-2.5">
          <input
            className="input-base"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... ou envie um arquivo"
          />
          <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-[9px] border border-dashed border-line-strong bg-paper px-3 py-2 text-[12.5px] font-medium text-ink-soft transition duration-150 hover:border-primary/50 hover:bg-primary-50 hover:text-primary">
            Enviar do computador
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
                e.currentTarget.value = "";
              }}
            />
          </label>

          {value && onCoverPosition && (
            <CoverCropper value={value} position={coverPosition ?? "50% 50%"} onChange={onCoverPosition} />
          )}
        </div>
      </div>

      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

function CoverCropper({
  value, position, onChange,
}: { value: string; position: string; onChange: (v: string) => void }) {
  const y = parseInt(position.split(" ")[1] ?? "50", 10) || 0;

  return (
    <div className="pt-1">
      <div
        className="relative h-[130px] w-full cursor-grab touch-none select-none overflow-hidden rounded-[9px] border border-line active:cursor-grabbing"
        onPointerDown={(e) => {
          const el = e.currentTarget;
          el.setPointerCapture(e.pointerId);
          const rect = el.getBoundingClientRect();
          const startY = e.clientY;
          const startPos = y;
          const move = (ev: PointerEvent) => {
            const delta = ((ev.clientY - startY) / rect.height) * 100;
            onChange(`50% ${Math.max(0, Math.min(100, Math.round(startPos + delta)))}%`);
          };
          const up = (ev: PointerEvent) => {
            el.releasePointerCapture(ev.pointerId);
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
          };
          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", up);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="" draggable={false} className="pointer-events-none h-full w-full object-cover" style={{ objectPosition: position }} />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-4 text-[10.5px] font-medium text-white">
          Arraste para cima ou baixo para enquadrar
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="shrink-0 text-[11px] text-muted">Ajuste fino</span>
        <input
          type="range"
          min={0}
          max={100}
          value={y}
          onChange={(e) => onChange(`50% ${e.target.value}%`)}
          aria-label="Ajuste fino do enquadramento da capa"
          className="h-1 w-full flex-1 cursor-pointer appearance-none rounded-full bg-line accent-[#145C4B]"
        />
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {[
          { label: "Topo", v: "50% 0%" },
          { label: "Centro", v: "50% 50%" },
          { label: "Base", v: "50% 100%" },
        ].map((p) => (
          <button
            key={p.v}
            type="button"
            onClick={() => onChange(p.v)}
            className={`rounded-[8px] border px-2 py-1.5 text-[11.5px] font-medium transition duration-150 ${
              position === p.v
                ? "border-primary/30 bg-primary-50 text-primary"
                : "border-line bg-white text-ink-soft hover:bg-paper-alt"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function LogoPreview({ url }: { url: string }) {
  if (!url) {
    return <span className="text-[12px] text-muted">Sem logo</span>;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="Pré-visualização da logo" className="h-full w-full object-contain p-1" />;
}
