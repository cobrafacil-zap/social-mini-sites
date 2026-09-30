"use client";

import { useLayout, Cover, Logo, LocationBlock, SocialRow, Gallery } from "./shared";

/**
 * 6. SERVIÇOS PREMIUM
 * Hero minimalista com respiro enorme · apresentação da empresa/profissional ·
 * serviços em cartões individuais numerados · galeria sofisticada (grid
 * assimétrico leve) · depoimentos · processo em 4 passos · CTA de agendamento.
 */
export function ServicePremium() {
  const { site, c, radius, go, wa, preview } = useLayout();
  const co = site.company;
  const services = [...site.buttons].sort((a, b) => a.order - b.order);

  const processo = [
    { n: "01", t: "Agendamento", d: "Escolha o melhor horário pelo WhatsApp." },
    { n: "02", t: "Avaliação", d: "Entendemos o que você precisa." },
    { n: "03", t: "Atendimento", d: "Execução com padrão de excellence." },
    { n: "04", t: "Acompanhamento", d: "Confirmação de resultado ao final." },
  ];

  return (
    <div className="min-h-full" style={{ background: c.background, color: c.text }}>
      {/* ---------- HERO MINIMALISTA ---------- */}
      <header className="px-6 pb-16 pt-16 text-center sm:pt-24">
        {co.logoUrl && <Logo src={co.logoUrl} size={58} radius={999} />}
        <p
          className="mt-8 text-[10px] font-medium uppercase tracking-[0.4em]"
          style={{ color: c.secondary }}
        >
          {co.category || "Serviço premium"}
        </p>
        <h1 className="mt-4 text-[34px] font-light uppercase leading-[1.12] tracking-[0.08em] sm:text-[42px]">
          {co.name || "Sua Marca"}
        </h1>
        {co.slogan && (
          <p className="mx-auto mt-6 max-w-[34ch] text-[14.5px] font-light leading-[2] opacity-65">
            {co.slogan}
          </p>
        )}
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => go("whatsapp", wa)}
          className="mt-10 inline-flex items-center gap-2 px-10 py-4 text-[11.5px] font-semibold uppercase tracking-[0.28em] text-white no-underline transition duration-200"
          style={{ background: c.primary, borderRadius: radius * 0.3 }}
        >
          Agendar atendimento
        </a>
      </header>

      {/* imagem hero em moldura fina */}
      {co.coverUrl && (
        <section className="px-6">
          <div
            className="overflow-hidden"
            style={{ borderRadius: radius * 0.3, boxShadow: `0 24px 60px -28px ${c.text}55` }}
          >
            <Cover src={co.coverUrl} position={co.coverPosition} className="h-[46vh] min-h-[300px] w-full" />
          </div>
        </section>
      )}

      {/* ---------- APRESENTAÇÃO ---------- */}
      {(co.shortDesc || co.history) && (
        <section className="px-6 py-20">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: c.secondary }}>
            Sobre
          </p>
          <div className="mx-auto mt-8 max-w-[56ch] space-y-5 text-center">
            {co.shortDesc && (
              <p className="text-[16px] font-light leading-[1.95]">{co.shortDesc}</p>
            )}
            {co.history && (
              <p className="text-[14px] font-light leading-[2] opacity-60">{co.history}</p>
            )}
          </div>
        </section>
      )}

      {/* ---------- SERVIÇOS INDIVIDUAIS ---------- */}
      {services.length > 0 && (
        <section className="px-6 pb-20">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: c.secondary }}>
            Serviços
          </p>
          <ul className="mt-10 space-y-3">
            {services.map((s, i) => (
              <li key={s.id}>
                <a
                  href={s.link || wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => go("outro", s.link || wa)}
                  className="group flex items-center gap-5 border px-5 py-6 no-underline transition duration-200"
                  style={{
                    borderRadius: radius * 0.35,
                    borderColor: `${c.text}14`,
                    background: i === 0 ? `${c.primary}05` : "transparent",
                  }}
                >
                  <span
                    className="shrink-0 text-[11px] font-semibold tabular-nums tracking-[0.18em]"
                    style={{ color: c.secondary }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-light uppercase tracking-[0.06em]">{s.name}</span>
                  </span>
                  <span
                    className="shrink-0 text-[16px] opacity-30 transition duration-200 group-hover:translate-x-1 group-hover:opacity-70"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- GALERIA SOFISTICADA ---------- */}
      {site.gallery.length > 0 && (
        <section className="px-6 pb-20">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: c.secondary }}>
            Galeria
          </p>
          <Gallery
            className="mt-10 grid grid-cols-4 gap-2.5"
            imageClassName="grayscale-[20%] hover:grayscale-0"
          />
        </section>
      )}

      {/* ---------- DEPOIMENTOS ---------- */}
      {co.history && (
        <section className="px-6 pb-20">
          <div
            className="mx-auto max-w-[60ch] text-center"
            style={{ background: `${c.primary}06`, borderRadius: radius * 0.35, padding: "34px 28px" }}
          >
            <span
              className="block text-[34px] font-light leading-none"
              style={{ color: c.secondary }}
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="mt-1 text-[15px] font-light leading-[1.95]">{co.history}</p>
            <p className="mt-5 text-[10.5px] font-semibold uppercase tracking-[0.34em] opacity-45">
              {co.name}
            </p>
          </div>
        </section>
      )}

      {/* ---------- PROCESSO ---------- */}
      <section className="px-6 pb-20">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: c.secondary }}>
          Como funciona
        </p>
        <ol className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
          {processo.map((p) => (
            <li key={p.n} className="text-center">
              <span className="mx-auto flex h-9 w-9 items-center justify-center border text-[11px] font-semibold tabular-nums" style={{ borderColor: `${c.text}22`, color: c.secondary, borderRadius: 999 }}>
                {p.n}
              </span>
              <p className="mt-3 text-[12.5px] font-semibold uppercase tracking-[0.14em]">{p.t}</p>
              <p className="mt-1.5 text-[12.5px] font-light leading-relaxed opacity-60">{p.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- ENCERRAMENTO + LOCAL ---------- */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-[420px]">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: c.secondary }}>
            Onde estamos
          </p>
          <div className="mt-7">
            <LocationBlock actionLabel="Como chegar" />
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <SocialRow />
        </div>
      </section>

      {/* ---------- CTA AGENDAMENTO ---------- */}
      {!preview && (
        <div className="px-6 pb-8">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => go("whatsapp", wa)}
            className="flex items-center justify-center gap-2 px-6 py-5 text-[13px] font-semibold uppercase tracking-[0.24em] text-white no-underline"
            style={{ background: c.primary, borderRadius: radius * 0.3 }}
          >
            Agendar atendimento
          </a>
          <p className="mt-6 text-center text-[11px] opacity-30">{co.name}</p>
        </div>
      )}
    </div>
  );
}