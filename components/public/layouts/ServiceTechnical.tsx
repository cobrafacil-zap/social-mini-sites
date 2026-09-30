"use client";

import { useLayout, Cover, Logo, OpenBadge, HoursTable, LocationBlock, SocialRow } from "./shared";

/**
 * 5. SERVIÇOS TÉCNICOS
 * Hero com proposta de valor + CTA imediato · lista de serviços com números ·
 * antes e depois (1ª e 2ª foto da galeria) · área atendida · diferenciais ·
 * depoimento (texto real) · solicitação de orçamento.
 */
export function ServiceTechnical() {
  const { site, c, radius, go, wa, preview } = useLayout();
  const co = site.company;
  const services = [...site.buttons].sort((a, b) => a.order - b.order);
  const [before, after] = site.gallery;
  const galleryRest = site.gallery.slice(2);

  const diferenciais = [
    { t: "Orçamento sem compromisso", d: "Você recebe o valor antes de qualquer serviço." },
    { t: "Garantia por escrito", d: "Garantia em todos os serviços realizados." },
    { t: "Atendimento ágil", d: "Procure já. Resposta pelo WhatsApp." },
  ];

  return (
    <div className="min-h-full" style={{ background: c.background, color: c.text }}>
      {/* ---------- HERO + PROPOSTA ---------- */}
      <header style={{ background: c.primary, color: "#fff" }}>
        <div className="px-5 pt-7">
          {co.logoUrl && <Logo src={co.logoUrl} size={48} radius={radius * 0.3} />}
          {co.category && (
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] opacity-70">
              {co.category}
            </p>
          )}
        </div>

        <div className="mt-4">
          <Cover
            src={co.coverUrl}
            position={co.coverPosition}
            className="h-[210px] w-full"
          />
        </div>

        <div className="px-5 pb-7">
          <h1 className="text-[30px] font-bold uppercase leading-[1.08] tracking-[-0.01em]">
            {co.name || "Serviços técnicos"}
          </h1>
          {co.slogan && <p className="mt-2.5 text-[14px] leading-relaxed opacity-85">{co.slogan}</p>}

          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => go("whatsapp", wa)}
            className="mt-5 flex w-full items-center justify-center gap-2 px-5 py-4 text-[15px] font-bold uppercase tracking-wide text-[#0A0A0A] no-underline transition duration-150 active:scale-[0.99]"
            style={{ background: c.secondary, borderRadius: radius * 0.4 }}
          >
            Solicitar orçamento
          </a>
          <div className="mt-2.5">
            <OpenBadge className="text-white [&>span]:!bg-white/40" />
          </div>
        </div>
      </header>

      {/* ---------- LISTA DE SERVIÇOS ---------- */}
      <section className="px-5 py-8">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: c.primary }}>
          Nossos serviços
        </h2>
        <ol className="mt-4">
          {(services.length ? services : [{ id: "x", name: "Serviço principal", icon: "briefcase", link: "", order: 0 }]).map(
            (s, i) => (
              <li
                key={s.id}
                className="flex items-center gap-4 border-b py-4 last:border-0"
                style={{ borderColor: `${c.text}12` }}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center text-[13px] font-bold tabular-nums"
                  style={{ background: c.primary, color: "#fff", borderRadius: radius * 0.3 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a
                  href={s.link || wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => go("outro", s.link || wa)}
                  className="min-w-0 flex-1 no-underline"
                >
                  <span className="block text-[14.5px] font-semibold leading-snug">{s.name}</span>
                  <span className="mt-0.5 block text-[12px] opacity-55">
                    {s.link ? "Saiba mais" : "Solicitar pelo WhatsApp"}
                  </span>
                </a>
              </li>
            ),
          )}
        </ol>
      </section>

      {/* ---------- ANTES E DEPOIS ---------- */}
      {before && after && (
        <section className="px-5 py-8">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: c.primary }}>
            Antes e depois
          </h2>
          <p className="mt-1 text-[11.5px] opacity-50">
            A primeira foto da galeria aparece como &quot;antes&quot; e a segunda como &quot;depois&quot;.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { src: before.url, tag: "Antes" },
              { src: after.url, tag: "Depois" },
            ].map((x) => (
              <figure key={x.tag} className="overflow-hidden" style={{ borderRadius: radius * 0.35 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={x.src} alt={`Serviço — ${x.tag}`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <figcaption
                  className="px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-white"
                  style={{ background: c.text }}
                >
                  {x.tag}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ---------- GALERIA RESTANTE ---------- */}
      {galleryRest.length > 0 && (
        <section className="px-5 py-8">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: c.primary }}>
            Trabalhos
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {galleryRest.slice(0, 6).map((item) => (
              <div key={item.id} className="aspect-square overflow-hidden" style={{ borderRadius: radius * 0.3 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- DIFERENCIAIS ---------- */}
      <section className="px-5 py-8" style={{ background: `${c.primary}08` }}>
        <h2 className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: c.primary }}>
          Por que contratar
        </h2>
        <ul className="mt-4 grid gap-3">
          {diferenciais.map((d) => (
            <li
              key={d.t}
              className="bg-white p-4"
              style={{ borderRadius: radius * 0.4, borderLeft: `3px solid ${c.secondary}` }}
            >
              <p className="text-[13.5px] font-bold">{d.t}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed opacity-70">{d.d}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- DEPOIMENTO ---------- */}
      {co.shortDesc && (
        <section className="px-5 py-8">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: c.primary }}>
            Clientes
          </h2>
          <blockquote
            className="mt-4 p-5"
            style={{ background: `${c.text}06`, borderRadius: radius * 0.4 }}
          >
            <p className="text-[14px] leading-[1.8]">&ldquo;{co.shortDesc}&rdquo;</p>
            {co.name && (
              <footer className="mt-3 text-[12px] font-bold uppercase tracking-[0.12em] opacity-50">
                {co.name}
              </footer>
            )}
          </blockquote>
        </section>
      )}

      {/* ---------- ÁREA ATENDIDA + HORÁRIO ---------- */}
      <section className="px-5 py-8">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: c.primary }}>
          Área de atendimento e horário
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="bg-white p-4" style={{ borderRadius: radius * 0.4 }}>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] opacity-50">Onde atendemos</p>
            <div className="mt-2">
              <LocationBlock actionLabel="Traçar rota" />
            </div>
          </div>
          <div className="bg-white p-4" style={{ borderRadius: radius * 0.4 }}>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] opacity-50">Funcionamento</p>
            <div className="mt-2">
              <HoursTable compact />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <SocialRow />
        </div>
      </section>

      {/* ---------- ORÇAMENTO ---------- */}
      {!preview && (
        <div className="sticky bottom-0 z-30 p-4" style={{ background: c.background, borderTop: `1px solid ${c.text}12` }}>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => go("whatsapp", wa)}
            className="flex items-center justify-center gap-2 px-5 py-4 text-[15px] font-bold uppercase tracking-wide text-[#0A0A0A] no-underline"
            style={{ background: c.secondary, borderRadius: radius * 0.4 }}
          >
            Solicitar orçamento
          </a>
        </div>
      )}

      <p className="px-5 pb-6 pt-3 text-center text-[11px] opacity-30">{co.name}</p>
    </div>
  );
}