"use client";

import { useLayout, Cover, Logo, LocationBlock, SocialRow, Gallery } from "./shared";

/**
 * 3. LOJA ELEGANTE
 * Hero editorial estilo revista · muito espaço negativo · coleções em blocos
 * fotográficos · novidades · destaques · CTA "Falar com a loja".
 */
export function BoutiqueElegant() {
  const { site, c, radius, go, wa, preview } = useLayout();
  const co = site.company;
  const g = site.gallery;
  const featured = g[0];
  const novidades = g.slice(1, 4);
  const destaques = g.slice(4, 7);

  return (
    <div className="min-h-full" style={{ background: c.background, color: c.text }}>
      {/* ---------- HERO EDITORIAL ---------- */}
      <header className="px-6 pt-14 text-center">
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
        <h1 className="mt-4 text-[40px] font-light uppercase leading-[1.02] tracking-[0.16em]">
          {co.name || "Sua Marca"}
        </h1>
        {co.slogan && (
          <p className="mx-auto mt-5 max-w-[30ch] text-[14px] font-light leading-[1.9] opacity-65">
            {co.slogan}
          </p>
        )}

        <div className="mx-auto mt-9 h-px w-10" style={{ background: c.secondary }} />

        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => go("whatsapp", wa)}
          className="mt-9 inline-flex items-center gap-2 border px-8 py-3.5 text-[11.5px] font-medium uppercase tracking-[0.24em] no-underline transition duration-200"
          style={{ borderColor: c.primary, color: c.primary, borderRadius: 0 }}
        >
          Falar com a loja
        </a>
      </header>

      {/* ---------- DESTAQUE / CAPA ---------- */}
      {featured && (
        <section className="mt-16 px-6">
          <div className="overflow-hidden" style={{ borderRadius: radius * 0.4 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.url}
              alt=""
              loading="lazy"
              className="h-[62vh] min-h-[380px] w-full object-cover"
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
        <section className="px-6 py-20">
          <h2 className="text-center text-[11px] font-medium uppercase tracking-[0.36em]">Novidades</h2>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {novidades.map((n) => (
              <figure key={n.id} className="group">
                <div className="overflow-hidden" style={{ borderRadius: radius * 0.35 }}>
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
        <section className="px-6 pb-20">
          <h2 className="text-center text-[11px] font-medium uppercase tracking-[0.36em]">Destaques</h2>
          <ul className="mt-10 space-y-8">
            {destaques.map((d, i) => (
              <li key={d.id} className={`flex items-center gap-5 ${i % 2 === 1 ? "flex-row-reverse" : ""}`}>
                <div
                  className="w-[42%] shrink-0 overflow-hidden"
                  style={{ borderRadius: radius * 0.35 }}
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
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-[52ch] text-center">
            <div className="mx-auto mb-6 h-px w-8" style={{ background: c.secondary }} />
            <p className="text-[14px] font-light leading-[2] opacity-75">{co.history}</p>
          </div>
        </section>
      )}

      {/* ---------- INSTAGRAM / GALERIA ---------- */}
      {site.gallery.length > 1 && (
        <section className="pb-20">
          <div className="px-6">
            <h2 className="text-center text-[11px] font-medium uppercase tracking-[0.36em]">
              Instagram
            </h2>
            {co.instagram && (
              <p className="mt-2 text-center text-[13px] opacity-55">@{co.instagram.replace(/^@/, "")}</p>
            )}
          </div>
          <Gallery
            className="mt-8 grid grid-cols-3 gap-1.5 px-6"
            imageClassName="grayscale-[35%] hover:grayscale-0 transition duration-500"
          />
        </section>
      )}

      {/* ---------- LOJA / LOCALIZAÇÃO ---------- */}
      <section className="px-6 pb-20">
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
        className="px-6 py-16 text-center"
        style={{ background: co.coverUrl ? undefined : `${c.primary}06` }}
      >
        {!preview && co.coverUrl && (
          <Cover src={co.coverUrl} position={co.coverPosition} className="mb-12 h-[180px] w-full" />
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