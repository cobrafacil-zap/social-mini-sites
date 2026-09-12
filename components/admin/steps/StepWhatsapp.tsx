"use client";

import type { Site } from "@/lib/types";
import { waLink } from "@/lib/links";
import { Field } from "./Field";

export function StepWhatsapp({ site, set }: { site: Site; set: (p: string, v: unknown) => void }) {
  const c = site.company;
  const preview = waLink(c.whatsapp, c.whatsappMessage);
  return (
    <div>
      <h2 style={sectionTitle}>WhatsApp</h2>
      <Field label="Número do WhatsApp">
        <input
          className="input-base"
          value={c.whatsapp}
          onChange={(e) => set("company.whatsapp", e.target.value)}
          placeholder="55 43 90000-0000"
        />
      </Field>
      <Field label="Mensagem automática" hint="Enviada quando o cliente clicar no botão do WhatsApp">
        <textarea
          className="input-base"
          rows={3}
          value={c.whatsappMessage}
          onChange={(e) => set("company.whatsappMessage", e.target.value)}
        />
      </Field>
      <div className="bg-[#F1F5F2] rounded-[10px] p-3 text-[12.5px] text-neutral-700">
        Link gerado: <span className="text-primary break-all">{preview}</span>
      </div>
    </div>
  );
}

const sectionTitle = { fontSize: 17, fontWeight: 600, color: "#181A17", marginBottom: 18 } as const;