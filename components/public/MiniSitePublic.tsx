"use client";

import { useEffect, useState } from "react";
import {
  MapPin, Phone, Instagram, Facebook, Globe, MessageCircle,
  Building2, ChevronLeft, ChevronRight, X, Star,
} from "lucide-react";
import type { Site, EventType, IconName } from "@/lib/types";
import { fullAddress, mapsEmbed, mapsLink, waLink, externalUrl, instaUrl } from "@/lib/links";
import { ICONS, radiusFor } from "@/lib/templates";
import { isOpenNow, todayIndex, DAYS } from "@/lib/hours";

type Props = {
  site: Site;
  interactive: boolean;
  onEvent: (type: EventType) => void;
};

export function MiniSitePublic({ site, interactive, onEvent }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const c = site.customization;
  const radius = radiusFor(c.buttonStyle);
  const open = isOpenNow(site.hours, now);
  const tIdx = todayIndex(now);

  function fire(field: EventType, url?: string) {
    if (!interactive) return;
    onEvent(field);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  const quickActions: { label: string; icon: IconName; field: EventType; url: string }[] = [];
  if (fullAddress(site.location)) {
    quickActions.push({ label: "Como chegar", icon: "map", field: "comoChegar", url: mapsLink(site.location) });
  }
  if (site.company.instagram) {
    quickActions.push({ label: "Instagram", icon: "instagram", field: "instagram", url: instaUrl(site.company.instagram) });
  }
  if (site.company.phone) {
    quickActions.push({ label: "Ligar", icon: "phone", field: "telefone", url: `tel:${site.company.phone}` });
  }

  return (
    <div className="ms-outer">
      <div
        className="ms-shell"
        style={{
          background: c.background,
          color: c.text,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* CAPA */}
        <div className="ms-cover" style={{ background: c.primary }}>
          {site.company.coverUrl ? (
            <img
              src={site.company.coverUrl}
              alt="capa"
              className="ms-cover-img"
              style={{ objectPosition: site.company.coverPosition || "50% 50%" }}
            />
          ) : (
            <div className="ms-cover-fallback" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }} />
          )}
          <div className="ms-cover-overlay" />
        </div>

        {/* LOGO + NOME */}
        <div className="ms-hero">
          <div
            className="ms-logo"
            style={{
              border: `3px solid ${c.background}`,
            }}
          >
            {site.company.logoUrl ? (
              <img src={site.company.logoUrl} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Building2 size={30} color={c.primary} />
            )}
          </div>

          <h1 className="ms-title">
            {site.company.name || "Nome da empresa"}
          </h1>
          <div className="ms-badges">
            <span className="ms-badge-cat" style={{ background: `${c.primary}1A`, color: c.primary }}>
              {site.company.category || "Categoria"}
            </span>
            <span className="ms-badge-open" style={{ color: open ? "#0E8F4F" : "#9C3B31" }}>
              <span className="ms-dot" style={{ background: open ? "#0E8F4F" : "#9C3B31" }} />
              {open ? "Aberto agora" : "Fechado agora"}
            </span>
          </div>
          {site.company.slogan && (
            <p className="ms-slogan">{site.company.slogan}</p>
          )}
          {/* CTA PRINCIPAL */}
          <button
            type="button"
            onClick={() => fire("whatsapp", waLink(site.company.whatsapp, site.company.whatsappMessage))}
            className="ms-cta-main"
            style={{ borderRadius: radius, background: "#1EA956" }}
          >
            <MessageCircle size={18} /> Falar no WhatsApp
          </button>

          {/* AÇÕES RÁPIDAS */}
          {quickActions.length > 0 && (
            <div className="ms-quick">
              {quickActions.map((q, i) => {
                const Icon = ICONS[q.icon] ?? MapPin;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => fire(q.field, q.url)}
                    className="ms-quick-btn"
                    style={{
                      border: `1px solid ${c.text}22`,
                      color: c.text,
                      borderRadius: radius,
                    }}
                  >
                    <Icon size={14} /> {q.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* GRID DESKTOP: 2 colunas */}
        <div className="ms-main-grid">
          {/* COLUNA ESQUERDA */}
          <div className="ms-col">
            {/* SOBRE */}
            {(site.company.shortDesc || site.company.history) && (
              <div className="ms-section">
                <h2 className="ms-h2">Sobre nós</h2>
                {site.company.shortDesc && (
                  <p className="ms-p">{site.company.shortDesc}</p>
                )}
                {site.company.history && (
                  <p className="ms-p-sm">{site.company.history}</p>
                )}
              </div>
            )}

            {/* GALERIA */}
            {site.gallery.length > 0 && (
              <div className="ms-section ms-gallery">
                <h2 className="ms-h2">Galeria</h2>
                <div className="ms-gallery-track">
                  {site.gallery.map((g, i) => (
                    <img
                      key={g.id}
                      src={g.url}
                      alt=""
                      onClick={() => interactive && setLightbox(i)}
                      className="ms-gallery-img"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* BOTÕES */}
            {site.buttons.length > 0 && (
              <div className="ms-section">
                <h2 className="ms-h2">O que você precisa?</h2>
                <div className="ms-buttons">
                  {[...site.buttons].sort((a, b) => a.order - b.order).map((b) => {
                    const Icon = ICONS[b.icon] ?? Star;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => fire("outro", externalUrl(b.link))}
                        className="ms-btn"
                        style={{
                          border: `1px solid ${c.primary}33`,
                          background: `${c.primary}0D`,
                          color: c.text,
                          borderRadius: radius,
                        }}
                      >
                        <Icon size={18} color={c.primary} />
                        {b.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA (sticky no desktop) */}
          <div className="ms-col ms-col-right">
            {/* LOCALIZAÇÃO */}
            {fullAddress(site.location) && (
              <div className="ms-section">
                <h2 className="ms-h2">Localização</h2>
                <p className="ms-address">
                  <MapPin size={15} style={{ flexShrink: 0, marginTop: 2 }} color={c.primary} />
                  {fullAddress(site.location)}
                </p>
                <div className="ms-map">
                  <iframe
                    title="mapa"
                    src={mapsEmbed(site.location)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fire("comoChegar", mapsLink(site.location))}
                  className="ms-map-btn"
                  style={{
                    border: `1px solid ${c.text}22`,
                    color: c.text,
                    borderRadius: radius,
                  }}
                >
                  <MapPin size={15} /> Como chegar
                </button>
              </div>
            )}

            {/* HORÁRIOS */}
            <div className="ms-section">
              <h2 className="ms-h2">Horários</h2>
              <div className="ms-hours" style={{ border: `1px solid ${c.text}14` }}>
                {DAYS.map((d, i) => {
                  const h = site.hours[d.key];
                  const isToday = i === tIdx;
                  return (
                    <div
                      key={d.key}
                      className="ms-hours-row"
                      style={{
                        background: isToday ? `${c.primary}0F` : "transparent",
                        borderBottom: i < 6 ? `1px solid ${c.text}0F` : "none",
                        fontWeight: isToday ? 600 : 400,
                      }}
                    >
                      <span>{d.label}</span>
                      <span style={{ opacity: h.closed ? 0.5 : 0.85 }}>
                        {h.closed ? "Fechado" : `${h.open} – ${h.close}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* REDES SOCIAIS */}
            {(site.company.instagram || site.company.facebook || site.company.website) && (
              <div className="ms-section">
                <div className="ms-socials">
                  {site.company.instagram && (
                    <button
                      type="button"
                      onClick={() => fire("instagram", instaUrl(site.company.instagram))}
                      className="ms-social-btn"
                      style={{ border: `1px solid ${c.text}22`, color: c.text }}
                    >
                      <Instagram size={18} />
                    </button>
                  )}
                  {site.company.facebook && (
                    <button
                      type="button"
                      onClick={() => fire("outro", externalUrl(site.company.facebook))}
                      className="ms-social-btn"
                      style={{ border: `1px solid ${c.text}22`, color: c.text }}
                    >
                      <Facebook size={18} />
                    </button>
                  )}
                  {site.company.website && (
                    <button
                      type="button"
                      onClick={() => fire("outro", externalUrl(site.company.website))}
                      className="ms-social-btn"
                      style={{ border: `1px solid ${c.text}22`, color: c.text }}
                    >
                      <Globe size={18} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* CTA FINAL */}
            <div className="ms-cta-box" style={{ background: c.primary }}>
              <p className="ms-cta-title">Quer falar com a gente?</p>
              <button
                type="button"
                onClick={() => fire("whatsapp", waLink(site.company.whatsapp, site.company.whatsappMessage))}
                className="ms-cta-box-btn"
                style={{ color: c.primary, borderRadius: radius }}
              >
                Chamar no WhatsApp
              </button>
            </div>
          </div>
        </div>

        <p className="ms-footer">Criado com Social Mini Sites</p>

        {/* BOTÃO FLUTUANTE WHATSAPP */}
        {interactive && (
          <button
            type="button"
            onClick={() => fire("whatsapp", waLink(site.company.whatsapp, site.company.whatsappMessage))}
            className="ms-float"
            aria-label="Falar no WhatsApp"
          >
            <MessageCircle size={24} color="#fff" />
          </button>
        )}

        {/* LIGHTBOX */}
        {lightbox !== null && site.gallery[lightbox] && (
          <div className="ms-lightbox" onClick={() => setLightbox(null)}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              className="ms-lightbox-close"
              aria-label="Fechar"
            >
              <X size={26} />
            </button>
            {lightbox > 0 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
                className="ms-lightbox-prev"
                aria-label="Anterior"
              >
                <ChevronLeft size={30} />
              </button>
            )}
            <img
              src={site.gallery[lightbox].url}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="ms-lightbox-img"
            />
            {lightbox < site.gallery.length - 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
                className="ms-lightbox-next"
                aria-label="Próxima"
              >
                <ChevronRight size={30} />
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        .ms-outer { background:#EDEBE4; min-height:100vh; position:relative; }
        .ms-shell { max-width:460px; margin:0 auto; min-height:100vh; position:relative; box-shadow:0 0 40px rgba(0,0,0,0.08); overflow:hidden; }
        .ms-cover { position:relative; height:190px; overflow:hidden; }
        .ms-cover-img, .ms-cover-fallback { width:100%; height:100%; object-fit:cover; }
        .ms-cover-overlay { position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.32) 100%); }
        .ms-hero { padding:0 20px; margin-top:-44px; position:relative; z-index:2; }
        .ms-logo { width:88px; height:88px; border-radius:24px; background:#fff; overflow:hidden; box-shadow:0 6px 20px rgba(0,0,0,0.16); display:flex; align-items:center; justify-content:center; position:relative; z-index:3; }
        .ms-title { font-family:'Inter', sans-serif; font-size:26px; font-weight:800; margin-top:14px; line-height:1.12; word-break:break-word; overflow-wrap:anywhere; position:relative; z-index:2; text-transform:uppercase; letter-spacing:0.4px; }
        .ms-badges { display:flex; align-items:center; gap:8px; margin-top:8px; flex-wrap:wrap; }
        .ms-badge-cat { font-size:12px; padding:4px 10px; border-radius:999px; font-weight:600; }
        .ms-badge-open { font-size:12.5px; display:flex; align-items:center; gap:5px; font-weight:600; }
        .ms-dot { width:6px; height:6px; border-radius:999px; display:inline-block; }
        .ms-slogan { font-size:14.5px; margin-top:9px; opacity:0.72; line-height:1.5; }
        .ms-cta-main { margin-top:18px; width:100%; color:#fff; border:none; padding:14px 16px; font-size:15px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; background:#1EA956 !important; box-shadow:0 4px 14px rgba(30,169,86,0.28); transition:transform .15s ease; }
        .ms-cta-main:active { transform:scale(.99); }
        .ms-quick { display:flex; gap:8px; margin-top:10px; overflow-x:auto; padding-bottom:2px; scrollbar-width:none; }
        .ms-quick::-webkit-scrollbar { display:none; }
        .ms-quick-btn { flex:0 0 auto; display:flex; align-items:center; gap:6px; background:transparent; padding:9px 13px; font-size:13px; font-weight:500; cursor:pointer; white-space:nowrap; transition:transform .15s ease; }
        .ms-quick-btn:active { transform:scale(.97); }
        .ms-main-grid { display:block; }
        .ms-section { padding:26px 20px 0; }
        .ms-section.ms-gallery { padding-left:20px; padding-right:0; }
        .ms-h2 { font-family:'Inter', sans-serif; font-size:15px; font-weight:800; margin-bottom:11px; text-transform:uppercase; letter-spacing:0.9px; opacity:.92; }
        .ms-p { font-size:14px; opacity:0.85; margin-bottom:6px; line-height:1.6; }
        .ms-p-sm { font-size:13.5px; opacity:0.7; line-height:1.65; }
        .ms-gallery-track { display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; padding-right:20px; scrollbar-width:none; }
        .ms-gallery-track::-webkit-scrollbar { display:none; }
        .ms-gallery-img { width:130px; height:130px; object-fit:cover; border-radius:14px; flex:0 0 auto; cursor:pointer; transition:transform .15s ease; }
        .ms-gallery-img:active { transform:scale(.97); }
        .ms-buttons { display:grid; grid-template-columns:1fr 1fr; gap:9px; }
        .ms-btn { padding:15px 10px; font-size:13px; font-weight:500; display:flex; flex-direction:column; align-items:center; gap:7px; cursor:pointer; text-align:center; line-height:1.3; transition:transform .15s ease; }
        .ms-btn:active { transform:scale(.98); }
        .ms-address { font-size:13.5px; opacity:0.8; margin-bottom:11px; display:flex; gap:6px; line-height:1.5; }
        .ms-map { border-radius:14px; overflow:hidden; height:140px; background:#eee; }
        .ms-map-btn { margin-top:10px; width:100%; background:transparent; padding:10px; font-size:13.5px; font-weight:600; display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; transition:transform .15s ease; }
        .ms-map-btn:active { transform:scale(.98); }
        .ms-hours { border-radius:14px; overflow:hidden; }
        .ms-hours-row { display:flex; justify-content:space-between; padding:10px 13px; font-size:13px; }
        .ms-socials { display:flex; gap:10px; }
        .ms-social-btn { width:44px; height:44px; border-radius:999px; background:transparent; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:transform .15s ease; }
        .ms-social-btn:active { transform:scale(.94); }
        .ms-cta-box { margin:28px 20px 0; padding:24px 22px; border-radius:18px; text-align:center; }
        .ms-cta-title { color:#fff; font-family:'Inter', sans-serif; font-size:17px; font-weight:800; margin-bottom:13px; text-transform:uppercase; letter-spacing:0.5px; line-height:1.3; }
        .ms-cta-box-btn { width:100%; background:#1EA956 !important; color:#fff !important; border:none; padding:13px; font-size:14.5px; font-weight:700; cursor:pointer; transition:transform .15s ease; }
        .ms-cta-box-btn:active { transform:scale(.98); }
        .ms-footer { text-align:center; font-size:11px; opacity:0.38; padding:22px 20px 26px; letter-spacing:.02em; }
        .ms-float { position:fixed; bottom:18px; right:18px; width:56px; height:56px; border-radius:999px; background:#1EA956 !important; border:none; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 24px rgba(30,169,86,0.4); cursor:pointer; z-index:40; transition:transform .15s ease; }
        .ms-float:active { transform:scale(.94); }
        .ms-lightbox { position:fixed; inset:0; background:rgba(0,0,0,0.92); z-index:50; display:flex; align-items:center; justify-content:center; }
        .ms-lightbox-close { position:absolute; top:16px; right:16px; color:#fff; background:transparent; border:none; cursor:pointer; }
        .ms-lightbox-prev, .ms-lightbox-next { position:absolute; color:#fff; background:rgba(255,255,255,0.1); border:none; border-radius:999px; width:42px; height:42px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .ms-lightbox-prev { left:12px; }
        .ms-lightbox-next { right:12px; }
        .ms-lightbox-img { max-width:88%; max-height:78%; object-fit:contain; border-radius:10px; }

        /* Tablet */
        @media (min-width: 768px) {
          .ms-shell { max-width:680px; }
          .ms-cover { height:260px; }
          .ms-hero { padding:0 32px; }
          .ms-section { padding:28px 32px 0; }
          .ms-section.ms-gallery { padding-left:32px; }
          .ms-gallery-img { width:158px; height:158px; }
          .ms-buttons { grid-template-columns:1fr 1fr 1fr; }
        }

        @media (min-width: 1024px) {
          .ms-outer { padding:36px 24px; }
          .ms-shell { max-width:1080px; border-radius:22px; box-shadow:0 1px 2px rgba(0,0,0,0.05), 0 24px 60px -20px rgba(0,0,0,0.22); }
          .ms-cover { height:340px; border-radius:22px 22px 0 0; }
          .ms-hero { padding:0 40px; display:block; }
          .ms-hero .ms-logo { width:96px; height:96px; border-radius:24px; }
          .ms-title { font-size:34px; letter-spacing:0.2px; }
          .ms-hero .ms-cta-main { max-width:520px; }
          .ms-hero .ms-quick { flex-wrap:wrap; overflow:visible; }
          .ms-main-grid { display:grid; grid-template-columns:1.55fr 0.85fr; gap:0 32px; padding:0 40px; align-items:start; }
          .ms-col-right { position:sticky; top:16px; }
          .ms-section { padding-left:0; padding-right:0; padding-top:32px; }
          .ms-section.ms-gallery { padding-left:0; }
          .ms-gallery-track { display:grid; grid-template-columns:repeat(3, 1fr); overflow:visible; padding-right:0; gap:10px; }
          .ms-gallery-img { width:100%; height:138px; }
          .ms-buttons { grid-template-columns:1fr 1fr; }
          .ms-map { height:200px; }
          .ms-cta-box { margin-left:0; margin-right:0; margin-top:32px; }
          .ms-footer { padding-bottom:34px; }
        }

        @media (min-width: 1280px) {
          .ms-gallery-img { height:148px; }
          .ms-buttons { grid-template-columns:1fr 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}

