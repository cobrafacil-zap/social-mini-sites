"use client";

import type { ReactNode } from "react";
import { useLayout, Cover, Logo, LocationBlock, SocialRow } from "./shared";

/**
 * 7. SAÚDE E BEM-ESTAR
 * Apresentação humana · foto + texto lado a lado · especialidades · para quem é ·
 * como funciona · perguntas frequentes (FAQ em acordeão) · online/presencial ·
 * CTA "Agendar atendimento".
 */
export function HealthWellness() {
  const { site, c, radius, go, wa, preview } = useLayout();
  const co = site.company;

  const especialidades = site.buttons.filter((b) => b.name.trim());
  const paraQuem = [
    {
      t: co.category || "Atendimento",
      d: co.slogan || shortFallback(co.shortDesc),
    },
    {
      t: "Presencial",
      d: "Atendimento no consultório, com hora marcada.",
    },
    {
      t: "Online",
      d: "Sessões por videochamada quando preferir.",
    },
  ];

  const comoFunciona = [
    { t: "Fale comigo", d: "Envie sua dúvida pelo WhatsApp, sem compromisso." },
    { t: "Agende", d: "Escolha o melhor dia e horário." },
    { t: "Sessão", d: "Atendimento com tempo reservado só para você." },
  ];

  const faq = buildFaq(site, co.shortDesc);

  return (
    <div className="min-h-full" style={{ background: c.background, color: c.text }}>
      {/* ---------- APRESENTAÇÃO HUMANA ---------- */}
      <header className="px-6 pb-14 pt-10">
        <div className="flex flex-col items-center gap-6 text-center">
          {co.logoUrl ? (
            <Logo src={co.logoUrl} size={96} radius={999} />
          ) : (
            <div
              className="flex h-24 w-24 items-center justify-center text-[26px] font-light"
              style={{ background: `${c.secondary}44`, color: c.primary, borderRadius: 999 }}
              aria-hidden="true"
            >
              {(co.name || "E").slice(0, 1)}
            </div>
          )}
          <div>
            {co.category && (
              <p className="text-[11px] font-medium uppercase tracking-[0.24em]" style={{ color: c.primary }}>
                {co.category}
              </p>
            )}
            <h1 className="mt-2.5 text-[30px] font-light leading-[1.15] tracking-[-0.01em]">
              {co.name || "Seu profissional"}
            </h1>
            {co.slogan && (
              <p className="mx-auto mt-3 max-w-[36ch] text-[14.5px] leading-[1.8] opacity-70">{co.slogan}</p>
            )}
          </div>
        </div>

        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => go("whatsapp", wa)}
          className="mt-8 flex w-full items-center justify-center gap-2 px-5 py-4 text-[14.5px] font-semibold text-white no-underline transition duration-150 active:scale-[0.99]"
          style={{ background: c.primary, borderRadius: radius }}
        >
          Agendar atendimento
        </a>
      </header>

      {/* ---------- FOTO + TEXTO LADO A LADO ---------- */}
      {(co.coverUrl || co.history || co.shortDesc) && (
        <section className="px-6 pb-16">
          <div
            className="overflow-hidden"
            style={{ borderRadius: radius * 1.2, background: `${c.secondary}26` }}
          >
            <Cover
              src={co.coverUrl}
              position={co.coverPosition}
              className="h-[280px] w-full"
            />
          </div>
          {(co.history || co.shortDesc) && (
            <div className="mt-7 space-y-4">
              {co.shortDesc && (
                <p className="text-[15px] leading-[1.9]">{co.shortDesc}</p>
              )}
              {co.history && (
                <p className="text-[14px] leading-[1.95] opacity-70">{co.history}</p>
              )}
            </div>
          )}
        </section>
      )}

      {/* ---------- ESPECIALIDADES ---------- */}
      {especialidades.length > 0 && (
        <section className="px-6 pb-16">
          <SectionTitle>Especialidades</SectionTitle>
          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {especialidades.map((b) => (
              <li key={b.id}>
                <a
                  href={b.link || wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => go("outro", b.link || wa)}
                  className="inline-flex border px-4 py-2.5 text-[13px] font-medium no-underline transition duration-150 hover:opacity-75"
                  style={{ borderRadius: radius, borderColor: `${c.primary}33`, color: c.primary }}
                >
                  {b.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- PARA QUEM É ---------- */}
      <section className="px-6 pb-16">
        <SectionTitle>Para quem é o atendimento</SectionTitle>
        <ul className="mt-5 space-y-3">
          {paraQuem.map((p, i) => (
            <li
              key={i}
              className="flex gap-4 bg-white p-4"
              style={{ borderRadius: radius * 0.8, boxShadow: "0 1px 2px rgb(0 0 0 / .04)" }}
            >
              <span
                className="mt-1 h-2 w-2 shrink-0 rounded-full"
                style={{ background: c.secondary }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-[14px] font-semibold">{p.t}</p>
                {p.d && <p className="mt-1 text-[13px] leading-relaxed opacity-65">{p.d}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- COMO FUNCIONA ---------- */}
      <section className="px-6 pb-16" style={{ background: `${c.primary}06` }}>
        <SectionTitle>Como funciona</SectionTitle>
        <ol className="mt-6 space-y-5">
          {comoFunciona.map((p, i) => (
            <li key={p.t} className="flex gap-4">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center text-[12px] font-semibold tabular-nums text-white"
                style={{ background: c.primary, borderRadius: 999 }}
              >
                {i + 1}
              </span>
              <div>
                <p className="text-[14px] font-semibold">{p.t}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed opacity-65">{p.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- PERGUNTAS FREQUENTES ---------- */}
      {faq.length > 0 && (
        <section className="px-6 pb-16">
          <SectionTitle>Perguntas frequentes</SectionTitle>
          <div className="mt-5 divide-y" style={{ borderColor: `${c.text}12` }}>
            {faq.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    className="shrink-0 text-[18px] leading-none opacity-40 transition duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-2.5 text-[13px] leading-[1.85] opacity-70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ---------- LOCAL / ONLINE ---------- */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-[420px]">
          <SectionTitle>Onde acontece</SectionTitle>
          <div className="mt-5">
            <LocationBlock actionLabel="Ver localização" />
          </div>
          <div className="mt-6 flex justify-center">
            <SocialRow />
          </div>
        </div>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section
        className="px-6 py-14 text-center"
        style={{ background: c.primary }}
      >
        <p className="text-[20px] font-light leading-[1.5] text-white">
          Quer conversar? <br /> Estou aqui para ajudar.
        </p>
        {!preview && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => go("whatsapp", wa)}
            className="mt-7 inline-flex items-center justify-center bg-white px-9 py-4 text-[14px] font-semibold text-[#0A0A0A] no-underline"
            style={{ borderRadius: radius }}
          >
            Agendar atendimento
          </a>
        )}
        <p className="mt-6 text-[11px] text-white/50">{co.name}</p>
      </section>
    </div>
  );

  function SectionTitle({ children }: { children: ReactNode }) {
    return (
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: c.primary }}>
        {children}
      </p>
    );
  }
}

function shortFallback(v?: string): string {
  return v || "Atendimento com hora marcada e espaço reservado para você.";
}

function buildFaq(site: ReturnType<typeof useLayout>["site"], shortDesc: string) {
  const out: { q: string; a: string }[] = [];
  if (site.company.whatsapp) {
    out.push({
      q: "Como agendo um horário?",
      a: "É só chamar no WhatsApp com o botão acima. Respondo com a disponibilidade e confirmo a melhor opção.",
    });
  }
  if (shortDesc) {
    out.push({ q: "Como funciona o atendimento?", a: shortDesc });
  }
  if (site.company.history) {
    out.push({ q: "Quem conduz o atendimento?", a: site.company.history });
  }
  if (site.company.phone) {
    out.push({
      q: "Posso ligar?",
      a: `Sim, o telefone ${site.company.phone} está disponível para falar direto.`,
    });
  }
  return out;
}