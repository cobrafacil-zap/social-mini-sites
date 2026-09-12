"use client";

import type { Site } from "@/lib/types";
import { Field } from "./Field";

export function StepLocal({ site, set }: { site: Site; set: (p: string, v: unknown) => void }) {
  const l = site.location;
  return (
    <div>
      <h2 style={sectionTitle}>Localização</h2>
      <Field label="Endereço">
        <input className="input-base" value={l.address} onChange={(e) => set("location.address", e.target.value)} />
      </Field>
      <div className="grid grid-cols-[1fr_2fr] gap-3">
        <Field label="Número">
          <input className="input-base" value={l.number} onChange={(e) => set("location.number", e.target.value)} />
        </Field>
        <Field label="Bairro">
          <input className="input-base" value={l.neighborhood} onChange={(e) => set("location.neighborhood", e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-3">
        <Field label="Cidade">
          <input className="input-base" value={l.city} onChange={(e) => set("location.city", e.target.value)} />
        </Field>
        <Field label="Estado">
          <input className="input-base" value={l.state} onChange={(e) => set("location.state", e.target.value)} placeholder="PR" />
        </Field>
        <Field label="CEP">
          <input className="input-base" value={l.zip} onChange={(e) => set("location.zip", e.target.value)} />
        </Field>
      </div>
      <Field label="Termo de busca no mapa (opcional)" hint="Deixe em branco para usar o endereço acima">
        <input className="input-base" value={l.mapsQuery} onChange={(e) => set("location.mapsQuery", e.target.value)} placeholder="Nome do local no Google Maps" />
      </Field>
    </div>
  );
}

const sectionTitle = { fontSize: 17, fontWeight: 600, color: "#181A17", marginBottom: 18 } as const;