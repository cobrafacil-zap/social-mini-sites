"use client";

import { useState } from "react";
import type { Site } from "@/lib/types";
import { slugify, isValidSlug } from "@/lib/slugify";
import { Field } from "./Field";

const MAX_BYTES = 4 * 1024 * 1024;

const CATEGORIAS = [
  "Restaurante",
  "Lanchonete",
  "Pizzaria",
  "Hamburgueria",
  "Bar / Pub",
  "Cafeteria",
  "Padaria",
  "Confeitaria",
  "Sorveteria / Açaí",
  "Loja de Roupas",
  "Loja de Calçados",
  "Loja de Moda Feminina",
  "Loja de Moda Masculina",
  "Loja Infantil",
  "Cosméticos / Maquiagem",
  "Salão de Beleza",
  "Barbearia",
  "Estética / Spa",
  "Academia / Fitness",
  "Clínica / Consultório",
  "Odontologia",
  "Farmácia",
  "Pet Shop",
  "Mercado / Supermercado",
  "Floricultura",
  "Oficina / Auto",
  "Imobiliária",
  "Advocacia",
  "Contabilidade",
  "Arquitetura / Engenharia",
  "Educação / Escola",
  "Tecnologia / Informática",
  "Marketing / Design",
  "Prestador de Serviços",
  "Profissional Autônomo",
  "Outros",
];

export function StepEmpresa({ site, set }: { site: Site; set: (p: string, v: unknown) => void }) {
  const c = site.company;
  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "smdigital.com").toLowerCase();
  const touched = (site as unknown as { slugTouched?: boolean }).slugTouched === true;
  const [upLogo, setUpLogo] = useState(false);
  const [upCover, setUpCover] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(file: File, field: "logoUrl" | "coverUrl") {
    setErr(null);
    if (file.size > MAX_BYTES) { setErr("Arquivo maior que 4 MB."); return; }
    const setter = field === "logoUrl" ? setUpLogo : setUpCover;
    setter(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error ?? "Falha no upload");
      } else {
        const { url } = await res.json();
        set(`company.${field}`, url);
      }
    } catch { setErr("Falha no upload"); }
    finally { setter(false); }
  }

  return (
    <div>
      <h2 style={sectionTitle}>Informações da empresa</h2>

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

      <Field label="Slug / URL" hint={`${site.slug || "..."}.${root}`}>
        <input
          className="input-base"
          value={site.slug}
          onChange={(e) => {
            set("slugTouched", true);
            set("slug", slugify(e.target.value));
          }}
          placeholder="villa-italia"
        />
        {site.slug && !isValidSlug(site.slug) && (
          <span className="block text-[12px] text-danger mt-1">
            Use apenas letras minúsculas, números e hífens.
          </span>
        )}
      </Field>

      <Field label="Categoria">
        <select className="input-base" value={CATEGORIAS.includes(c.category) ? c.category : c.category ? "Outros" : ""} onChange={(e) => set("company.category", e.target.value)}>
          <option value="" disabled>Selecione a categoria</option>
          {CATEGORIAS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        {c.category && !CATEGORIAS.includes(c.category) && (
          <input className="input-base mt-2" value={c.category} onChange={(e) => set("company.category", e.target.value)} placeholder="Digite a categoria" />
        )}
      </Field>

      <Field label="Slogan">
        <input className="input-base" value={c.slogan} onChange={(e) => set("company.slogan", e.target.value)} placeholder="Sabor autêntico da Itália" />
      </Field>

      <Field label="Descrição curta">
        <textarea className="input-base" rows={2} value={c.shortDesc} onChange={(e) => set("company.shortDesc", e.target.value)} />
      </Field>

      <Field label="História da empresa">
        <textarea className="input-base" rows={4} value={c.history} onChange={(e) => set("company.history", e.target.value)} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Logo da empresa">
          <input className="input-base mb-2" value={c.logoUrl} onChange={(e) => set("company.logoUrl", e.target.value)} placeholder="https://... ou faça upload" />
          <input type="file" accept="image/*" disabled={upLogo} onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, "logoUrl"); e.currentTarget.value=""; }} className="text-[13px]" />
          {upLogo && <span className="text-[12px] text-muted">Enviando...</span>}
          {c.logoUrl && <img src={c.logoUrl} alt="logo preview" className="mt-2 w-16 h-16 object-cover rounded-lg border border-line" />}
        </Field>
        <Field label="Foto de capa">
          <input className="input-base mb-2" value={c.coverUrl} onChange={(e) => set("company.coverUrl", e.target.value)} placeholder="https://... ou faça upload" />
          <input type="file" accept="image/*" disabled={upCover} onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, "coverUrl"); e.currentTarget.value=""; }} className="text-[13px]" />
          {upCover && <span className="text-[12px] text-muted">Enviando...</span>}
          {c.coverUrl && (
            <>
              <img
                src={c.coverUrl}
                alt="capa preview"
                className="mt-2 w-full h-[80px] object-cover rounded-lg border border-line"
                style={{ objectPosition: c.coverPosition || "50% 50%" }}
              />
              <label className="block text-[12px] text-muted mt-2">Ajustar enquadramento (qual parte da foto aparece):</label>
              <input
                type="range"
                min={0}
                max={100}
                value={parseInt((c.coverPosition || "50% 50%").split(" ")[1] || "50", 10)}
                onChange={(e) => set("company.coverPosition", `50% ${e.target.value}%`)}
                className="w-full mt-1"
              />
              <div className="flex justify-between text-[11px] text-muted">
                <span>Topo</span><span>Centro</span><span>Base</span>
              </div>
              <div className="flex gap-1 mt-2">
                {[
                  { label: "Topo", v: "50% 0%" },
                  { label: "Centro", v: "50% 50%" },
                  { label: "Base", v: "50% 100%" },
                ].map((p) => (
                  <button key={p.v} type="button" onClick={() => set("company.coverPosition", p.v)} className={`text-[11px] px-2 py-1 rounded-md border ${(c.coverPosition || "50% 50%") === p.v ? "bg-primary text-white border-primary" : "bg-white border-line"}`}>{p.label}</button>
                ))}
              </div>
            </>
          )}
        </Field>
      </div>
      {err && <p className="text-danger text-[12.5px] mb-2">{err}</p>}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Telefone">
          <input className="input-base" value={c.phone} onChange={(e) => set("company.phone", e.target.value)} placeholder="(43) 3000-0000" />
        </Field>
        <Field label="E-mail">
          <input className="input-base" value={c.email} onChange={(e) => set("company.email", e.target.value)} placeholder="contato@empresa.com" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Instagram">
          <input className="input-base" value={c.instagram} onChange={(e) => set("company.instagram", e.target.value)} placeholder="@empresa" />
        </Field>
        <Field label="Facebook">
          <input className="input-base" value={c.facebook} onChange={(e) => set("company.facebook", e.target.value)} placeholder="facebook.com/empresa" />
        </Field>
      </div>

      <Field label="Site">
        <input className="input-base" value={c.website} onChange={(e) => set("company.website", e.target.value)} placeholder="www.empresa.com" />
      </Field>
    </div>
  );
}

const sectionTitle = { fontSize: 17, fontWeight: 600, color: "#181A17", marginBottom: 18 } as const;