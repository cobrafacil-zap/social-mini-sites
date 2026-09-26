"use client";

import { MessageCircle, ExternalLink } from "lucide-react";
import type { Site } from "@/lib/types";
import { waLink } from "@/lib/links";
import { Field, StepHeader } from "./Field";

export function StepWhatsapp({ site, set }: { site: Site; set: (p: string, v: unknown) => void }) {
  const c = site.company;
  const preview = waLink(c.whatsapp, c.whatsappMessage);
  const hasNumber = /\d{6,}/.test(c.whatsapp ?? "");

  return (
    <div>
      <StepHeader
        icon={MessageCircle}
        title="WhatsApp"
        description="É o botão principal do mini site. Configure o número e a mensagem que será enviada."
      />

      <Field label="Número do WhatsApp" hint="Com DDI e DDD. Ex.: 5543999999999">
        <input
          className="input-base"
          inputMode="tel"
          value={c.whatsapp}
          onChange={(e) => set("company.whatsapp", e.target.value)}
          placeholder="5543999999999"
        />
      </Field>

      <Field label="Mensagem automática" hint="Enviada quando o visitante clicar no botão do WhatsApp.">
        <textarea
          className="input-base"
          rows={3}
          value={c.whatsappMessage}
          onChange={(e) => set("company.whatsappMessage", e.target.value)}
        />
      </Field>

      <div
        className={`rounded-xl border p-3.5 ${hasNumber ? "border-ok/20 bg-ok-50" : "border-dashed border-line-strong bg-paper"}`}
      >
        <p className="text-[11.5px] font-medium uppercase tracking-wide text-ink-muted">Link gerado</p>
        {hasNumber ? (
          <a
            href={preview}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-start gap-1.5 break-all text-[12px] leading-relaxed text-ok no-underline hover:underline"
          >
            {preview}
            <ExternalLink size={12} className="mt-0.5 shrink-0" />
          </a>
        ) : (
          <p className="mt-1 text-[12px] text-muted">Informe o número acima para visualizar o link.</p>
        )}
      </div>
    </div>
  );
}
