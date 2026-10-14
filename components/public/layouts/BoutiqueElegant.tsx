"use client";

import { useLayout, Cover, Logo, LocationBlock, SocialRow, Gallery } from "./shared";

/**
 * 3. LOJA ELEGANTE
 * Hero editorial estilo revista · muito espaço negativo · coleções em blocos
 * fotográficos · novidades · destaques · CTA "Falar com a loja".
 */
export function BoutiqueElegant() {
  const { site, c, radius, surface, go, wa, preview } = useLayout();
  const co = site.company;
  const g = site.gallery;
  const featured = g[0];
  const novidades = g.slice(1, 4);
  const destaques = g.slice(4, 7);

  return (
    <div className="min-h-full" style={{ background: c.background, color: c.text }}>
      {/* ---------- HERO EDITORIAL ---------- */}
      <header className="px-5 pt-9 text-center sm:px-6 sm:pt-14">
        {co.logoUrl && (
          <Logo
            src={co.logoUrl}
            size={64}
            radius={999}
          />
        )}
        {co.category && (
          <p
            className="mt-6 text-[10.5px] font-medium uppercase tracking-[0.42em]"
            style={{ color: c.secondary }}
          >
            {co.category}
          </p>
        )}
        <h1 className="mt-4 text-[clamp(1.8rem,8vw,2.5rem)] font-light uppercase leading-[1.02] tracking-[0.08em] sm:tracking-[0.16em]">
          {co.name || "Sua Marca"}
        </h1>
        {co.slogan && (
          <p className="mx-auto mt-5 max-w-[30ch] text-[14px] font-light leading-[1.9] opacity-65">
            {co.slogan}
          </p>
        )}

        <div className="mx-auto mt-7 h-px w-10 sm:mt-9" style={{ background: c.secondary }} />

        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => go("whatsapp", wa)}
          className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 border px-6 py-3.5 text-center text-[11.5px] font-medium uppercase tracking-[0.18em] no-underline transition duration-200 sm:mt-9 sm:px-8 sm:tracking-[0.24em]"
          style={{ borderColor: c.primary, color: c.primary, borderRadius: 0 }}
        >
          Falar com a loja
        </a>
      </header>

      {/* ---------- DESTAQUE / CAPA ---------- */}
      {featured && (
        <section className="mt-10 px-5 sm:mt-16 sm:px-6">
          <div className="overflow-hidden" style={{ borderRadius: surface }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.url}
              alt=""
              loading="lazy"
              className="h-[52vh] min-h-[260px] w-full object-cover sm:h-[62vh] sm:min-h-[380px]"
              style={{ objectPosition: "50% 30%" }}
            />
          </div>
          <p className="mt-4 text-center text-[10.5px] uppercase tracking-[0.34em] opacity-45">
            Coleção da temporada
          </p>
        </section>
      )}

      {/* ---------- NOVIDADES ---------- */}
      {novidades.length > 0 && (
        <section className="px-5 py-12 sm:px-6 sm:py-20">
          <h2 className="text-center text-[11px] font-medium uppercase tracking-[0.36em]">Novidades</h2>
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-10 sm:grid-cols-3 sm:gap-3">
            {novidades.map((n) => (
              <figure key={n.id} className="group">
                <div className="overflow-hidden" style={{ borderRadius: surface * 0.7 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={n.url}
                    alt=""
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ---------- DESTAQUES DA COLEÇÃO ---------- */}
      {destaques.length > 0 && (
        <section className="px-5 pb-12 sm:px-6 sm:pb-20">
          <h2 className="text-center text-[11px] font-medium uppercase tracking-[0.36em]">Destaques</h2>
          <ul className="mt-6 space-y-6 sm:mt-10 sm:space-y-8">
            {destaques.map((d, i) => (
              <li key={d.id} className={`flex items-center gap-5 ${i % 2 === 1 ? "flex-row-reverse" : ""}`}>
                <div
                  className="w-[42%] shrink-0 overflow-hidden"
                  style={{ borderRadius: surface * 0.7 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.url} alt="" loading="lazy" className="aspect-[3/4] w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] uppercase tracking-[0.28em]" style={{ color: c.secondary }}>
                    Peça {String(i + 1).padStart(2, "0")}
                  </p>
                  {co.shortDesc && (
                    <p className="mt-2 line-clamp-3 text-[13.5px] font-light leading-[1.85] opacity-70">
                      {co.shortDesc}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- SOBRE ---------- */}
      {co.history && (
        <section className="px-5 pb-12 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-[52ch] text-center">
            <div className="mx-auto mb-6 h-px w-8" style={{ background: c.secondary }} />
            <p className="text-[14px] font-light leading-[2] opacity-75">{co.history}</p>
          </div>
        </section>
      )}

      {/* ---------- INSTAGRAM / GALERIA ---------- */}
      {site.gallery.length > 1 && (
        <section className="px-0 pb-12 sm:pb-20">
          <div className="px-6">
            <h2 className="text-center text-[11px] font-medium uppercase tracking-[0.36em]">
              Instagram
            </h2>
            {co.instagram && (
              <p className="mt-2 text-center text-[13px] opacity-55">@{co.instagram.replace(/^@/, "")}</p>
            )}
          </div>
          <Gallery
            className="mt-6 grid grid-cols-3 gap-1.5 px-5 sm:mt-8 sm:px-6"
            imageClassName="grayscale-[35%] hover:grayscale-0 transition duration-500"
          />
        </section>
      )}

      {/* ---------- LOJA / LOCALIZAÇÃO ---------- */}
      <section className="px-5 pb-12 sm:px-6 sm:pb-20">
        <h2 className="text-center text-[11px] font-medium uppercase tracking-[0.36em]">A loja</h2>
        <div className="mx-auto mt-8 max-w-[420px]">
          <LocationBlock actionLabel="Agendar visita" />
        </div>
        <div className="mt-8 flex justify-center">
          <SocialRow size={44} />
        </div>
      </section>

      {/* ---------- CTA FINAL (colado) ---------- */}
      <footer
        className="px-5 py-12 text-center sm:px-6 sm:py-16"
        style={{ background: co.coverUrl ? undefined : `${c.primary}06` }}
      >
        {!preview && co.coverUrl && (
          <Cover src={co.coverUrl} position={co.coverPosition} className="mb-8 h-[150px] w-full sm:mb-12 sm:h-[180px]" />
        )}
        <p className="text-[11px] font-medium uppercase tracking-[0.34em] opacity-45">Atendimento</p>
        <p className="mt-4 text-[22px] font-light uppercase tracking-[0.1em]">
          Encontre a sua peça
        </p>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => go("whatsapp", wa)}
          className="mt-7 inline-flex items-center gap-2 px-9 py-3.5 text-[11.5px] font-medium uppercase tracking-[0.24em] text-white no-underline"
          style={{ background: c.primary, borderRadius: 0 }}
        >
          Falar com a loja
        </a>
      </footer>

      <p className="pb-6 text-center text-[11px] opacity-25">{co.name}</p>
    </div>
  );
}
