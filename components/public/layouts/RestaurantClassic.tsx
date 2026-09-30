"use client";

import { useLayout, Cover, Logo, OpenBadge, HoursTable, LocationBlock, SocialRow, Gallery } from "./shared";

/**
 * 1. RESTAURANTE CLÁSSICO
 * Hero gastronômico full-bleed · logo sobreposto · cardápio por categorias ·
 * "Mais pedidos" · galeria · barra fixa de WhatsApp.
 */
export function RestaurantClassic() {
  const { site, c, radius, go, wa, preview } = useLayout();
  const co = site.company;

  // "Mais pedidos" e "cardápio" saem dos botões reais do editor
  const menuLinks = [...site.buttons].sort((a, b) => a.order - b.order);
  const dishes = site.gallery.slice(0, 4);

  return (
    <div className="min-h-full" style={{ background: c.background, color: c.text }}>
      {/* ---------- HERO gastronômico ---------- */}
      <header className="relative">
        <Cover
          src={co.coverUrl}
          position={co.coverPosition}
          className="h-[58vh] min-h-[340px] w-full"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,.34) 0%, rgba(0,0,0,0) 34%, rgba(0,0,0,.6) 100%)" }}
        />

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="flex items-end gap-3">
            {co.logoUrl && (
              <Logo
                src={co.logoUrl}
                size={62}
                radius={16}
              />
            )}
            <div className="min-w-0 flex-1">
              {co.category && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-85">{co.category}</p>
              )}
              <h1 className="mt-1 text-[28px] font-bold uppercase leading-[1.08] tracking-[0.01em]">
                {co.name || "Nome do restaurante"}
              </h1>
            </div>
          </div>

          {co.slogan && <p className="mt-2.5 text-[14px] opacity-90">{co.slogan}</p>}

          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => go("whatsapp", wa)}
              className="inline-flex items-center gap-2 bg-white px-5 py-3 text-[14px] font-bold no-underline transition duration-150 active:scale-[0.98]"
              style={{ borderRadius: radius, color: c.primary }}
            >
              Ver cardápio
            </a>
            <span className="inline-flex items-center gap-1.5 border border-white/40 px-3.5 py-2.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: openColor() }}
                aria-hidden="true"
              />
              <span className="text-[12.5px] font-semibold text-white">{openLabel()}</span>
            </span>
          </div>
        </div>
      </header>

      {/* ---------- HORÁRIO EM DESTAQUE ---------- */}
      <section className="px-5 py-7" style={{ background: `${c.primary}08` }}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: c.primary }}>
            Horário de funcionamento
          </h2>
          <OpenBadge className="shrink-0" />
        </div>
        <div className="mt-3">
          <HoursTable compact />
        </div>
      </section>

      {/* ---------- MAIS PEDIDOS ---------- */}
      {dishes.length > 0 && (
        <section className="px-5 py-8">
          <h2 className="text-[19px] font-bold uppercase tracking-wide">Mais pedidos</h2>
          <div className="no-scrollbar -mx-5 mt-4 flex gap-3 overflow-x-auto px-5">
            {dishes.map((g) => (
              <figure
                key={g.id}
                className="w-[150px] shrink-0 overflow-hidden bg-white shadow-sm"
                style={{ borderRadius: radius }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.url} alt="" loading="lazy" className="h-[110px] w-full object-cover" />
                <figcaption className="px-3 py-2.5 text-[11.5px] font-medium opacity-70">Do cardápio</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ---------- CARDÁPIO POR CATEGORIAS ---------- */}
      {menuLinks.length > 0 && (
        <section className="px-5 py-8">
          <h2 className="text-[19px] font-bold uppercase tracking-wide">Cardápio</h2>
          <div className="mt-4 space-y-3">
            {menuLinks.map((b) => (
              <a
                key={b.id}
                href={b.link || wa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => go("outro", b.link || wa)}
                className="flex items-center justify-between gap-3 border px-4 py-4 no-underline transition duration-150 hover:opacity-80"
                style={{ borderRadius: radius, borderColor: `${c.primary}2A`, background: "#fff" }}
              >
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold" style={{ color: c.text }}>
                    {b.name}
                  </span>
                  <span className="mt-0.5 block text-[12px] opacity-55">
                    {b.link ? b.link.replace(/^https?:\/\//, "") : "Peça pelo WhatsApp"}
                  </span>
                </span>
                <span
                  className="shrink-0 text-[12px] font-bold uppercase tracking-wide"
                  style={{ color: c.primary }}
                >
                  →
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ---------- SOBRE ---------- */}
      {co.history && (
        <section className="px-5 py-8">
          <h2 className="text-[19px] font-bold uppercase tracking-wide">Sobre nós</h2>
          <p className="mt-3 text-[14px] leading-[1.75] opacity-80">{co.history}</p>
        </section>
      )}

      {/* ---------- GALERIA ---------- */}
      {site.gallery.length > 0 && (
        <section className="py-8">
          <h2 className="px-5 text-[19px] font-bold uppercase tracking-wide">Galeria</h2>
          <Gallery
            className="mt-4 grid grid-cols-2 gap-2 px-5 sm:grid-cols-3"
            imageClassName=""
          />
        </section>
      )}

      {/* ---------- LOCALIZAÇÃO ---------- */}
      <section className="px-5 py-8">
        <h2 className="text-[19px] font-bold uppercase tracking-wide">Onde estamos</h2>
        <div className="mt-3">
          <LocationBlock />
        </div>
      </section>

      <div className="px-5 pb-4">
        <SocialRow />
      </div>

      {/* ---------- BARRA FIXA DE WHATSAPP ---------- */}
      {!preview && (
        <div
          className="sticky bottom-0 z-30 flex items-center gap-3 px-5 py-3 shadow-[0_-6px_20px_-8px_rgba(0,0,0,.18)]"
          style={{ background: c.background, borderTop: `1px solid ${c.text}14` }}
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold">{co.name}</p>
            <p className="text-[11.5px] opacity-55">Reservas e pedidos</p>
          </div>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => go("whatsapp", wa)}
            className="shrink-0 bg-[#1EA956] px-5 py-3 text-[13.5px] font-bold text-white no-underline"
            style={{ borderRadius: radius }}
          >
            Falar no WhatsApp
          </a>
        </div>
      )}

      <p className="px-5 pb-6 pt-2 text-center text-[11px] opacity-35">Criado com Social Mini Sites</p>
    </div>
  );

  function openLabel(): string {
    return open ? "Aberto agora" : "Fechado agora";
  }

  function openColor(): string {
    return open ? "#7BE3A5" : "#FF9E94";
  }
}