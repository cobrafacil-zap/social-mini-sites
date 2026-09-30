"use client";

import { useLayout, Cover, HoursTable, LocationBlock, SocialRow } from "./shared";

/**
 * 2. RESTAURANTE MODERNO
 * Hero em DUAS COLUNAS (texto + produto) · oferta do dia · combos em cards
 * horizontais · avaliação real · CTA fixo "Pedir agora".
 */
export function RestaurantModern() {
  const { site, c, radius, go, wa, preview, open } = useLayout();
  const co = site.company;
  const combos = site.gallery.slice(0, 3);
  const orderButtons = site.buttons.filter((b) => /ped|delivery|reserv|encomend|agend/i.test(b.name + b.link));

  return (
    <div className="min-h-full" style={{ background: c.background, color: c.text }}>
      {/* ---------- HERO DIVIDIDO ---------- */}
      <header className="grid grid-cols-1">
        {/* coluna texto */}
        <div className="relative z-10 px-5 pt-8" style={{ background: c.background }}>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{ background: c.secondary, color: c.primary, borderRadius: radius * 0.5 }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: c.primary }} aria-hidden="true" />
            {open ? "Aberto agora" : "Fechado agora"}
          </span>

          <h1 className="mt-3 text-[38px] font-black uppercase leading-[0.95] tracking-[-0.03em]">
            {co.name || "Seu Delivery"}
          </h1>
          {co.slogan && <p className="mt-2.5 text-[15px] font-medium leading-snug opacity-70">{co.slogan}</p>}

          {/* oferta do dia */}
          <div
            className="mt-5 flex items-center gap-3 p-3.5"
            style={{ background: c.primary, color: "#fff", borderRadius: radius }}
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center text-[18px] font-black"
              style={{ background: c.secondary, color: c.primary, borderRadius: radius * 0.5 }}
            >
              %
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-70">Oferta do dia</p>
              <p className="truncate text-[14px] font-semibold">
                {orderButtons[0]?.name ?? combos[0] ? "Consulte o cardápio no WhatsApp" : "Peça pelo WhatsApp"}
              </p>
            </div>
          </div>

          {/* botões grandes de pedido */}
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => go("whatsapp", wa)}
              className="flex items-center justify-center bg-[#1EA956] px-4 py-4 text-[15px] font-black uppercase tracking-wide text-white no-underline transition duration-150 active:scale-[0.98]"
              style={{ borderRadius: radius }}
            >
              Pedir agora
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => go("whatsapp", wa)}
              className="flex items-center justify-center border-2 px-4 py-4 text-[15px] font-black uppercase tracking-wide no-underline transition duration-150 active:scale-[0.98]"
              style={{ borderRadius: radius, borderColor: c.primary, color: c.primary }}
            >
              Delivery
            </a>
          </div>
        </div>

        {/* coluna produto */}
        <div className="relative -mt-4 px-5" style={{ zIndex: 0 }}>
          <Cover
            src={co.coverUrl}
            position={co.coverPosition}
            className="h-[240px] w-full shadow-lg"
            imgClassName=""
          />
          <div className="-mt-6 flex justify-center">
            <span
              className="relative z-10 px-4 py-2 text-[11.5px] font-black uppercase tracking-[0.16em]"
              style={{ background: c.secondary, color: c.primary, borderRadius: radius * 0.4 }}
            >
              {co.category || "Cardápio"}
            </span>
          </div>
        </div>
      </header>

      {/* ---------- COMBOS ---------- */}
      {combos.length > 0 && (
        <section className="px-5 py-9">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[22px] font-black uppercase tracking-[-0.02em]">Combos</h2>
            <span className="text-[11.5px] font-bold uppercase tracking-[0.12em]" style={{ color: c.secondary }}>
              Mais pedidos
            </span>
          </div>

          <div className="no-scrollbar -mx-5 mt-4 flex gap-3 overflow-x-auto px-5">
            {combos.map((g, i) => (
              <article
                key={g.id}
                className="w-[210px] shrink-0 border-2 bg-white"
                style={{ borderRadius: radius, borderColor: c.text }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.url} alt="" loading="lazy" className="h-[140px] w-full object-cover" />
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[14px] font-bold uppercase leading-tight">
                      {orderButtons[i]?.name ?? "Combo da casa"}
                    </h3>
                    {i === 0 && (
                      <span
                        className="shrink-0 px-1.5 py-0.5 text-[10px] font-black uppercase"
                        style={{ background: c.secondary, color: c.primary, borderRadius: 4 }}
                      >
                        Top
                      </span>
                    )}
                  </div>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => go("whatsapp", wa)}
                    className="mt-3 flex items-center justify-center bg-[#1EA956] px-3 py-2.5 text-[12.5px] font-black uppercase text-white no-underline"
                    style={{ borderRadius: radius * 0.5 }}
                  >
                    Pedir
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ---------- AVALIAÇÕES (texto real do editor) ---------- */}
      {(co.shortDesc || co.history) && (
        <section className="px-5 py-9">
          <h2 className="text-[22px] font-black uppercase tracking-[-0.02em]">Quem come, recomenda</h2>
          <div className="mt-4 space-y-3">
            {[co.shortDesc, co.history].filter(Boolean).map((t, i) => (
              <figure
                key={i}
                className="border-l-4 bg-white p-4"
                style={{ borderRadius: radius * 0.5, borderLeftColor: c.secondary }}
              >
                <p className="text-[13.5px] leading-relaxed">{t}</p>
                <figcaption className="mt-2 text-[11.5px] font-bold uppercase tracking-[0.1em] opacity-45">
                  {co.name || "Cliente"}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ---------- HORÁRIO + DELIVERY ---------- */}
      <section className="px-5 py-9">
        <h2 className="text-[22px] font-black uppercase tracking-[-0.02em]">Funcionamento</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <HoursTable compact />
          </div>
          <div
            className="p-4"
            style={{ background: `${c.primary}0F`, borderRadius: radius }}
          >
            <p className="text-[11.5px] font-black uppercase tracking-[0.14em]" style={{ color: c.primary }}>
              Delivery
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed opacity-80">
              {co.shortDesc || "Peça pelo WhatsApp e receba em casa."}
            </p>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => go("whatsapp", wa)}
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-black uppercase text-[#1EA956] no-underline hover:underline"
            >
              Pedir agora →
            </a>
          </div>
        </div>
      </section>

      {/* ---------- LOCALIZAÇÃO ---------- */}
      <section className="px-5 py-9">
        <h2 className="text-[22px] font-black uppercase tracking-[-0.02em]">Onde fica</h2>
        <div className="mt-4">
          <LocationBlock actionLabel="Ver no mapa" />
        </div>
        <div className="mt-4">
          <SocialRow />
        </div>
      </section>

      {/* ---------- CTA FIXO ---------- */}
      {!preview && (
        <div
          className="sticky bottom-0 z-30 px-4 py-3"
          style={{ background: c.background, borderTop: `2px solid ${c.text}` }}
        >
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => go("whatsapp", wa)}
            className="flex items-center justify-center gap-2 bg-[#1EA956] px-5 py-4 text-[16px] font-black uppercase tracking-wide text-white no-underline"
            style={{ borderRadius: radius }}
          >
            Pedir agora
          </a>
        </div>
      )}

      <p className="px-5 pb-6 pt-3 text-center text-[11px] opacity-30">
        {co.name || "Criado com Social Mini Sites"}
      </p>
    </div>
  );
}