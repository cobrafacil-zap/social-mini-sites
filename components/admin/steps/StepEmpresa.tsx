"use client";

import type { Site } from "@/lib/types";
import { slugify, isValidSlug } from "@/lib/slugify";
import { Field } from "./Field";

export function StepEmpresa({ site, set }: { site: Site; set: (p: string, v: unknown) => void }) {
  const c = site.company;
  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "smdigital.com").toLowerCase();
  const touched = (site as unknown as { slugTouched?: boolean }).slugTouched === true;

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
        <input className="input-base" value={c.category} onChange={(e) => set("company.category", e.target.value)} placeholder="Restaurante italiano" />
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
        <Field label="URL do logo">
          <input className="input-base" value={c.logoUrl} onChange={(e) => set("company.logoUrl", e.target.value)} placeholder="https://..." />
        </Field>
        <Field label="URL da foto de capa">
          <input className="input-base" value={c.coverUrl} onChange={(e) => set("company.coverUrl", e.target.value)} placeholder="https://..." />
        </Field>
      </div>

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