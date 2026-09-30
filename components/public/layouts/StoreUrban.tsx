"use client";

import { useLayout, Cover, Logo, LocationBlock, SocialRow } from "./shared";

/**
 * 4. LOJA URBANA
 * Hero fullscreen com título gigante sobreposto · banner de lançamento com
 * marquee · grid assimétrico de produtos · "Drops" em scroll horizontal ·
 * Instagram integrado · CTA de WhatsApp.
 */
export function StoreUrban() {
  const { site, c, radius, go, wa, preview } = useLayout();
  const co = site.company;
  const g = site.gallery;
  const drop = g[0];
  const rest = g.slice(1);

  // grid assimétrico: 2 colunas com alturas alternadas
  const grid = rest.slice(0, 4);

  return (
    <div className="min-h-full overflow-x-hidden" style={{ background: c.background, color: c.text }}>
      {/* ---------- HERO FULLSCREEN ---------- */}
      <header className="relative min-h-[86vh]">
        <Cover
          src={co.coverUrl}
          position={co.coverPosition}
          className="absolute inset-0 h-full w-full"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,.1) 45%, rgba(0,0,0,.82) 100%)" }}
        />

        {/* badge diagonal */}
        {!preview && (
          <span
            className="absolute right-0 top-8 rotate-6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#0A0A0A]"
            style={{ background: c.secondary }}
          >
            Drop ativo
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-5">
          {co.logoUrl && <Logo src={co.logoUrl} size={54} radius={radius * 0.4} />}
          <h1 className="mt-4 text-[46px] font-black uppercase leading-[0.88] tracking-[-0.045em]">
            {co.name || "SUA MARCA"}
          </h1>
          {co.slogan && (
            <p className="mt-3 max-w-[26ch] text-[13px] font-medium uppercase tracking-wide text-white/85">
              {co.slogan}
            </p>
          )}
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => go("whatsapp", wa)}
            className="mt-5 inline-flex items-center gap-2 px-7 py-4 text-[14px] font-black uppercase tracking-wide text-[#0A0A0A] no-underline transition duration-150 active:scale-[0.98]"
            style={{ background: c.secondary, borderRadius: radius * 0.35 }}
          >
            Comprar agora
          </a>
        </div>
      </header>

      {/* ---------- MARQUEE / BANNER ---------- */}
      {!preview && (
        <div
          className="overflow-hidden py-2.5"
          style={{ background: c.primary }}
          aria-hidden="true"
        >
          <Marquee text={marqueeText(co.category)} color={c.secondary} />
        </div>
      )}

      {/* ---------- LANÇAMENTO ---------- */}
      {drop && (
        <section className="p-5">
          <div
            className="relative overflow-hidden"
            style={{ borderRadius: radius, border: `2px solid ${c.text}` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={drop.url}
              alt=""
              loading="lazy"
              className="h-[300px] w-full object-cover"
              style={{ objectPosition: "50% 35%" }}
            />
            <div
              className="absolute inset-x-0 bottom-0 p-4"
              style={{ background: "linear-gradient(180deg, transparent, rgba(0,0,0,.86))" }}
            >
              <p className="text-[10.5px] font-black uppercase tracking-[0.2em]" style={{ color: c.secondary }}>
                Lançamento
              </p>
              <p className="mt-1 text-[19px] font-black uppercase leading-tight text-white">
                {(site.buttons[0]?.name || co.name) || "Novo drop"}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ---------- GRID ASSIMÉTRICO ---------- */}
      {grid.length > 0 && (
        <section className="p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[26px] font-black uppercase tracking-[-0.03em]">Produtos</h2>
            <span className="h-[3px] w-12" style={{ background: c.secondary }} aria-hidden="true" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {grid.map((item, i) => (
              <figure
                key={item.id}
                className={`${i % 3 === 0 ? "translate-y-4" : ""} ${i % 3 === 1 ? "-translate-y-2" : ""}`}
              >
                <div
                  className="overflow-hidden"
                  style={{ borderRadius: radius * 0.4, border: `1.5px solid ${c.text}` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt=""
                    loading="lazy"
                    className={`w-full object-cover transition duration-300 hover:scale-105 ${
                      i % 2 === 0 ? "aspect-[3/4]" : "aspect-square"
                    }`}
                  />
                </div>
                {i === 0 && (
                  <span
                    className="mt-2 inline-block px-2 py-0.5 text-[10px] font-black uppercase text-[#0A0A0A]"
                    style={{ background: c.secondary, borderRadius: 3 }}
                  >
                    Novo
                  </span>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ---------- DROPS ---------- */}
      {rest.length > 1 && (
        <section className="mt-6">
          <h2 className="px-5 text-[26px] font-black uppercase tracking-[-0.03em]">Drops</h2>
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto px-5 pb-2">
            {rest.slice(1).map((d, i) => (
              <a
                key={d.id}
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => go("whatsapp", wa)}
                className="w-[190px] shrink-0 no-underline"
              >
                <div
                  className="overflow-hidden"
                  style={{ borderRadius: radius * 0.4, background: c.text }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.url} alt="" loading="lazy" className="h-[190px] w-full object-cover opacity-95" />
                </div>
                <p className="mt-2 text-[11px] font-black uppercase tracking-[0.14em]" style={{ color: c.secondary }}>
                  Drop {String(i + 2).padStart(2, "0")}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ---------- INSTAGRAM ---------- */}
      {site.gallery.length > 0 && (
        <section className="mt-8 p-5" style={{ background: c.text }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[19px] font-black uppercase tracking-tight" style={{ color: c.background }}>
              Instagram
            </h2>
            {co.instagram && (
              <span className="text-[12px] font-bold" style={{ color: c.secondary }}>
                @{co.instagram.replace(/^@/, "")}
              </span>
            )}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-1.5">
            {site.gallery.slice(0, 8).map((item) => (
              <div key={item.id} className="aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="" loading="lazy" className="h-full w-full object-cover opacity-85" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- LOCALIZAÇÃO ---------- */}
      <section className="p-5">
        <h2 className="text-[26px] font-black uppercase tracking-[-0.03em]">Onde estamos</h2>
        <div className="mt-4">
          <LocationBlock actionLabel="Direções" />
        </div>
        <div className="mt-4">
          <SocialRow />
        </div>
      </section>

      {/* ---------- CTA WHATSAPP ---------- */}
      {!preview && (
        <div className="p-5">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => go("whatsapp", wa)}
            className="flex items-center justify-center gap-2 bg-[#1EA956] px-5 py-5 text-[16px] font-black uppercase tracking-wide text-white no-underline"
            style={{ borderRadius: radius * 0.4 }}
          >
            Falar no WhatsApp
          </a>
        </div>
      )}

      <p className="pb-6 text-center text-[11px] font-bold uppercase tracking-[0.2em] opacity-30">
        {co.name}
      </p>
    </div>
  );
}

function Marquee({ text, color }: { text: string; color: string }) {
  const chunk = Array.from({ length: 6 }, () => text).join("   •   ");
  return (
    <div className="flex whitespace-nowrap" aria-hidden="true">
      <span
        className="animate-[ms-marquee_22s_linear_infinite] shrink-0 pr-8 text-[13px] font-black uppercase tracking-[0.28em]"
        style={{ color }}
      >
        {chunk}
      </span>
      <span
        className="animate-[ms-marquee_22s_linear_infinite] shrink-0 pr-8 text-[13px] font-black uppercase tracking-[0.28em]"
        style={{ color }}
      >
        {chunk}
      </span>
      <style>{`@keyframes ms-marquee{from{transform:translateX(0)}to{transform:translateX(-100%)}}`}</style>
    </div>
  );
}

function marqueeText(category: string): string {
  return `${category || "Streetwear"} • lançamento • entrega para todo o Brasil •`;
}