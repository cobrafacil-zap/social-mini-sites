"use client";

import { MapPin } from "lucide-react";
import type { Site } from "@/lib/types";
import { Field, StepHeader } from "./Field";
import { fullAddress, mapsEmbed } from "@/lib/links";

export function StepLocal({ site, set }: { site: Site; set: (p: string, v: unknown) => void }) {
  const l = site.location;
  const address = fullAddress(l);

  return (
    <div>
      <StepHeader
        icon={MapPin}
        title="Localização"
        description="Endereço e mapa. O bloco 'Como chegar' só aparece no mini site se houver endereço."
      />

      <Field label="Endereço">
        <input
          className="input-base"
          value={l.address}
          onChange={(e) => set("location.address", e.target.value)}
          placeholder="Rua das Palmeiras"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Número">
          <input className="input-base" value={l.number} onChange={(e) => set("location.number", e.target.value)} placeholder="123" />
        </Field>
        <Field label="Bairro">
          <input className="input-base" value={l.neighborhood} onChange={(e) => set("location.neighborhood", e.target.value)} placeholder="Centro" />
        </Field>
        <Field label="CEP">
          <input className="input-base" value={l.zip} onChange={(e) => set("location.zip", e.target.value)} placeholder="86000-000" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Cidade">
          <input className="input-base" value={l.city} onChange={(e) => set("location.city", e.target.value)} placeholder="Londrina" />
        </Field>
        <Field label="Estado">
          <input
            className="input-base uppercase"
            maxLength={2}
            value={l.state}
            onChange={(e) => set("location.state", e.target.value.toUpperCase())}
            placeholder="PR"
          />
        </Field>
        <Field label="Termo de busca no mapa" hint="Opcional. Vence o endereço.">
          <input className="input-base" value={l.mapsQuery} onChange={(e) => set("location.mapsQuery", e.target.value)} placeholder="Nome no Google Maps" />
        </Field>
      </div>

      {address && (
        <div className="mt-1 overflow-hidden rounded-xl border border-line">
          <div className="flex items-center gap-2 border-b border-line bg-paper px-3.5 py-2.5">
            <MapPin size={13} className="shrink-0 text-primary" />
            <p className="truncate text-[12.5px] text-ink-soft">{address}</p>
          </div>
          <iframe
            title="Pré-visualização do mapa"
            src={mapsEmbed(l)}
            className="h-[190px] w-full border-0"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
