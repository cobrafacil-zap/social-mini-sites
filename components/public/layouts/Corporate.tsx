"use client";

import { useLayout, Cover, Logo, HoursTable, LocationBlock, SocialRow } from "./shared";

/**
 * 8. CORPORATIVO
 * Hero institucional forte · indicadores reais · áreas de atuação (grid
 * estruturado) · sobre · diferenciais · cases (galeria) · contato comercial.
 */
export function Corporate() {
  const { site, c, radius, go, wa, preview } = useLayout();
  const co = site.company;
  const areas = [...site.buttons].sort((a, b) => a.order - b.order);

  // Indicadores estruturais reais (derivados dos campos preenchidos no painel)
  const diasAbertos = Object.values(site.hours).filter((d) => !d.closed).length;
  const canais = [co.whatsapp, co.phone, co.email].filter(Boolean).length;
  const indicadores = [
    { k: "Áreas de atuação", v: String(areas.length) },
    { k: "Dias de atendimento", v: `${diasAbertos}/7` },
    { k: "Canais de contato", v: String(canais) },
  ];

  const diferenciais = [
    "Atendimento personalizado",
    "Transparência em todas as etapas",
    "Prazo e escopo definidos em contrato",
  ];

  return (
    <div className="min-h-full" style={{ background: c.background, color: c.text }}>
      {/* ---------- HERO INSTITUCIONAL ---------- */}
      <header style={{ background: c.primary, color: "#fff" }}>
        <div className="mx-auto max-w-[1100px] px-5">
          <div className="flex items-center gap-3 pt-6">
            {co.logoUrl ? (
              <Logo src={co.logoUrl} size={40} radius={radius * 0.3} />
            ) : null}
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.16em]">
              {co.name || "Sua Empresa"}
            </span>
          </div>

          <div className="grid gap-6 pb-10 pt-9 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10">
            <div>
              {co.category && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-65">
                  {co.category}
                </p>
              )}
              <h1 className="mt-3 text-[32px] font-bold uppercase leading-[1.08] tracking-[-0.01em] sm:text-[40px]">
                {co.slogan || co.name || "Soluções para o seu negócio"}
              </h1>
              {co.shortDesc && (
                <p className="mt-4 max-w-[46ch] text-[14.5px] leading-[1.85] opacity-80">{co.shortDesc}</p>
              )}
              <div className="mt-7 flex flex-wrap gap-2.5">
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => go("whatsapp", wa)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#0A0A0A] no-underline transition duration-150 active:scale-[0.98]"
                  style={{ background: c.secondary, borderRadius: radius * 0.35 }}
                >
                  Contato comercial
                </a>
                {co.email && (
                  <a
                    href={`mailto:${co.email}`}
                    className="inline-flex items-center gap-2 border border-white/30 px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-white no-underline transition duration-150 hover:bg-white/10"
                    style={{ borderRadius: radius * 0.35 }}
                  >
                    {co.email}
                  </a>
                )}
              </div>
            </div>

            <div
              className="overflow-hidden"
              style={{ borderRadius: radius * 0.35, boxShadow: "0 20px 50px -22px rgb(0 0 0 / .5)" }}
            >
              <Cover src={co.coverUrl} position={co.coverPosition} className="h-[230px] w-full lg:h-[300px]" />
            </div>
          </div>
        </div>
      </header>

      {/* ---------- INDICADORES ---------- */}
      <section className="border-b" style={{ borderColor: `${c.text}12` }}>
        <div className="mx-auto grid max-w-[1100px] grid-cols-3 gap-px" style={{ background: `${c.text}10` }}>
          {indicadores.map((ind) => (
            <div key={ind.k} className="px-4 py-6 text-center" style={{ background: c.background }}>
              <p className="text-[28px] font-bold leading-none tracking-[-0.03em] tabular-nums" style={{ color: c.primary }}>
                {ind.v}
              </p>
              <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] opacity-55">{ind.k}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- ÁREAS DE ATUAÇÃO ---------- */}
      {areas.length > 0 && (
        <section className="px-5 py-12">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em]" style={{ color: c.primary }}>
              Áreas de atuação
            </h2>
            <ul className="mt-5 grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: `${c.text}12` }}>
              {areas.map((a, i) => (
                <li key={a.id}>
                  <a
                    href={a.link || wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => go("outro", a.link || wa)}
                    className="group flex h-full flex-col justify-between p-5 no-underline transition duration-200"
                    style={{ background: c.background }}
                  >
                    <div>
                      <span
                        className="text-[10.5px] font-semibold tabular-nums tracking-[0.18em]"
                        style={{ color: c.secondary }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-2 text-[15px] font-semibold leading-snug">{a.name}</p>
                    </div>
                    <span
                      className="mt-5 text-[12px] font-medium opacity-40 transition duration-200 group-hover:opacity-90"
                      aria-hidden="true"
                    >
                      Consultar →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- SOBRE ---------- */}
      {co.history && (
        <section className="px-5 py-12" style={{ background: `${c.primary}06` }}>
          <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <h2 className="text-[22px] font-bold uppercase leading-tight tracking-[-0.01em]">
                Sobre a empresa
              </h2>
              <div className="mt-4 h-[3px] w-12" style={{ background: c.secondary }} aria-hidden="true" />
            </div>
            <p className="text-[14.5px] leading-[1.95] opacity-80">{co.history}</p>
          </div>
        </section>
      )}

      {/* ---------- DIFERENCIAIS ---------- */}
      <section className="px-5 py-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em]" style={{ color: c.primary }}>
            Diferenciais
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {diferenciais.map((d, i) => (
              <li key={d} className="border-t-2 pt-4" style={{ borderColor: i === 0 ? c.secondary : `${c.text}18` }}>
                <p className="text-[14px] font-semibold leading-snug">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- CASES ---------- */}
      {site.gallery.length > 0 && (
        <section className="px-5 py-12">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em]" style={{ color: c.primary }}>
              Cases
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {site.gallery.slice(0, 4).map((g, i) => (
                <li
                  key={g.id}
                  className={`overflow-hidden ${i % 3 === 0 ? "lg:row-span-2" : ""}`}
                  style={{ borderRadius: radius * 0.3 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.url}
                    alt=""
                    loading="lazy"
                    className="h-[150px] w-full object-cover transition duration-300 hover:opacity-90 lg:h-full lg:min-h-[150px]"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- CONTATO COMERCIAL ---------- */}
      <section className="px-5 py-12" style={{ background: c.primary, color: "#fff" }}>
        <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-[24px] font-bold uppercase leading-tight tracking-[-0.01em]">
              Vamos conversar
            </h2>
            <p className="mt-3 max-w-[40ch] text-[14px] leading-[1.85] opacity-80">
              Conte o que você precisa. Respondemos pelo WhatsApp com o próximo passo.
            </p>
            {!preview && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => go("whatsapp", wa)}
                className="mt-6 inline-flex items-center gap-2 px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0A0A0A] no-underline"
                style={{ background: c.secondary, borderRadius: radius * 0.35 }}
              >
                Falar com a equipe
              </a>
            )}
          </div>

          <div className="grid content-start gap-3">
            <ContactRow label="WhatsApp" value={co.whatsapp} href={wa} onClick={() => go("whatsapp", wa)} />
            <ContactRow label="Telefone" value={co.phone} href={co.phone ? `tel:${co.phone}` : undefined} onClick={() => go("telefone")} />
            <ContactRow label="E-mail" value={co.email} href={co.email ? `mailto:${co.email}` : undefined} />
            <div className="mt-2">
              <HoursTable compact />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- RODAPÉ ---------- */}
      <section className="px-5 py-12">
        <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em]" style={{ color: c.primary }}>
              Nossa sede
            </h2>
            <div className="mt-4">
              <LocationBlock actionLabel="Como chegar" />
            </div>
          </div>
          <div className="flex items-end justify-start lg:justify-end">
            <SocialRow size={44} />
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-[1100px] border-t pt-6 text-[11px] opacity-35" style={{ borderColor: `${c.text}12` }}>
          © {new Date().getFullYear()} {co.name || "Sua empresa"}. Todos os direitos reservados.
        </p>
      </section>
    </div>
  );
}

function ContactRow({
  label, value, href, onClick,
}: { label: string; value?: string; href?: string; onClick?: () => void }) {
  if (!value) return null;
  const inner = (
    <>
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-60">{label}</span>
      <span className="truncate text-[13.5px] font-medium">{value}</span>
    </>
  );
  const cls =
    "flex w-full items-center justify-between gap-3 border border-white/15 px-4 py-3 text-left transition duration-150 hover:bg-white/5";
  const style = { borderRadius: 8 };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={cls} style={style}>
        {inner}
      </a>
    );
  }
  return (
    <span className={cls} style={style}>
      {inner}
    </span>
  );
}