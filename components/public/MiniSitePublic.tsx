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
    <div style={{ background: "#EDEBE4", minHeight: "100%", position: "relative" }}>
      <div
        style={{
          maxWidth: 460,
          margin: "0 auto",
          background: c.background,
          color: c.text,
          fontFamily: "'Inter', sans-serif",
          minHeight: "100%",
          position: "relative",
          boxShadow: "0 0 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* CAPA */}
        <div style={{ position: "relative", height: 190, background: c.primary, overflow: "hidden" }}>
          {site.company.coverUrl ? (
            <img src={site.company.coverUrl} alt="capa" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)" }} />
        </div>

        {/* LOGO + NOME */}
        <div style={{ padding: "0 20px", marginTop: -44, position: "relative" }}>
          <div
            style={{
              width: 88, height: 88, borderRadius: 22, background: "#fff",
              border: `3px solid ${c.background}`, overflow: "hidden",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {site.company.logoUrl ? (
              <img src={site.company.logoUrl} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Building2 size={30} color={c.primary} />
            )}
          </div>

          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, marginTop: 14, lineHeight: 1.15 }}>
            {site.company.name || "Nome da empresa"}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12.5, padding: "3px 10px", borderRadius: 999, background: `${c.primary}1A`, color: c.primary, fontWeight: 500 }}>
              {site.company.category || "Categoria"}
            </span>
            <span style={{ fontSize: 12.5, display: "flex", alignItems: "center", gap: 4, color: open ? "#0E8F4F" : "#9C3B31", fontWeight: 500 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: open ? "#0E8F4F" : "#9C3B31", display: "inline-block" }} />
              {open ? "Aberto agora" : "Fechado agora"}
            </span>
          </div>
          {site.company.slogan && (
            <p style={{ fontSize: 14.5, marginTop: 8, opacity: 0.75, fontStyle: "italic" }}>{site.company.slogan}</p>
          )}

          {/* CTA PRINCIPAL */}
          <button
            type="button"
            onClick={() => fire("whatsapp", waLink(site.company.whatsapp, site.company.whatsappMessage))}
            style={{
              marginTop: 16, width: "100%", background: "#1EA956", color: "#fff",
              border: "none", borderRadius: radius, padding: "13px 16px", fontSize: 15,
              fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, cursor: "pointer",
            }}
          >
            <MessageCircle size={18} /> Falar no WhatsApp
          </button>

          {/* AÇÕES RÁPIDAS */}
          {quickActions.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto", paddingBottom: 2 }}>
              {quickActions.map((q, i) => {
                const Icon = ICONS[q.icon] ?? MapPin;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => fire(q.field, q.url)}
                    style={{
                      flex: "0 0 auto", display: "flex", alignItems: "center", gap: 6,
                      border: `1px solid ${c.text}22`, background: "transparent", color: c.text,
                      borderRadius: radius, padding: "8px 13px", fontSize: 13, fontWeight: 500, cursor: "pointer",
                    }}
                  >
                    <Icon size={14} /> {q.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* SOBRE */}
        {(site.company.shortDesc || site.company.history) && (
          <div style={{ padding: "26px 20px 6px" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, marginBottom: 8 }}>Sobre nós</h2>
            {site.company.shortDesc && (
              <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 6 }}>{site.company.shortDesc}</p>
            )}
            {site.company.history && (
              <p style={{ fontSize: 13.5, opacity: 0.7, lineHeight: 1.55 }}>{site.company.history}</p>
            )}
          </div>
        )}

        {/* GALERIA */}
        {site.gallery.length > 0 && (
          <div style={{ padding: "22px 0 6px 20px" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, marginBottom: 10, paddingRight: 20 }}>Galeria</h2>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, paddingRight: 20 }}>
              {site.gallery.map((g, i) => (
                <img
                  key={g.id}
                  src={g.url}
                  alt=""
                  onClick={() => interactive && setLightbox(i)}
                  style={{
                    width: 132, height: 132, objectFit: "cover", borderRadius: 12,
                    flex: "0 0 auto", cursor: interactive ? "pointer" : "default",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* BOTÕES */}
        {site.buttons.length > 0 && (
          <div style={{ padding: "24px 20px 6px" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, marginBottom: 10 }}>O que você precisa?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
              {[...site.buttons].sort((a, b) => a.order - b.order).map((b) => {
                const Icon = ICONS[b.icon] ?? Star;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => fire("outro", externalUrl(b.link))}
                    style={{
                      border: `1px solid ${c.primary}33`, background: `${c.primary}0D`, color: c.text,
                      borderRadius: radius, padding: "14px 10px", fontSize: 13, fontWeight: 500,
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                      cursor: "pointer", textAlign: "center",
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

        {/* LOCALIZAÇÃO */}
        {fullAddress(site.location) && (
          <div style={{ padding: "24px 20px 6px" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, marginBottom: 10 }}>Localização</h2>
            <p style={{ fontSize: 13.5, opacity: 0.8, marginBottom: 10, display: "flex", gap: 6 }}>
              <MapPin size={15} style={{ flexShrink: 0, marginTop: 2 }} color={c.primary} />
              {fullAddress(site.location)}
            </p>
            <div style={{ borderRadius: 12, overflow: "hidden", height: 140, background: "#eee" }}>
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
              style={{
                marginTop: 10, width: "100%", border: `1px solid ${c.text}22`,
                background: "transparent", color: c.text, borderRadius: radius,
                padding: "10px", fontSize: 13.5, fontWeight: 500,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer",
              }}
            >
              <MapPin size={15} /> Como chegar
            </button>
          </div>
        )}

        {/* HORÁRIOS */}
        <div style={{ padding: "24px 20px 6px" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, marginBottom: 10 }}>Horários</h2>
          <div style={{ border: `1px solid ${c.text}14`, borderRadius: 12, overflow: "hidden" }}>
            {DAYS.map((d, i) => {
              const h = site.hours[d.key];
              const isToday = i === tIdx;
              return (
                <div
                  key={d.key}
                  style={{
                    display: "flex", justifyContent: "space-between", padding: "9px 13px",
                    fontSize: 13, background: isToday ? `${c.primary}0F` : "transparent",
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
        <div style={{ padding: "24px 20px 6px", display: "flex", gap: 10 }}>
          {site.company.instagram && (
            <button
              type="button"
              onClick={() => fire("instagram", instaUrl(site.company.instagram))}
              style={socialBtn(c.text)}
            >
              <Instagram size={18} />
            </button>
          )}
          {site.company.facebook && (
            <button
              type="button"
              onClick={() => fire("outro", externalUrl(site.company.facebook))}
              style={socialBtn(c.text)}
            >
              <Facebook size={18} />
            </button>
          )}
          {site.company.website && (
            <button
              type="button"
              onClick={() => fire("outro", externalUrl(site.company.website))}
              style={socialBtn(c.text)}
            >
              <Globe size={18} />
            </button>
          )}
        </div>

        {/* CTA FINAL */}
        <div style={{ margin: "26px 20px 90px", padding: 22, borderRadius: 16, background: c.primary, textAlign: "center" }}>
          <p style={{ color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 18, marginBottom: 12 }}>
            Quer falar com a gente?
          </p>
          <button
            type="button"
            onClick={() => fire("whatsapp", waLink(site.company.whatsapp, site.company.whatsappMessage))}
            style={{
              width: "100%", background: "#fff", color: c.primary, border: "none",
              borderRadius: radius, padding: "12px", fontSize: 14.5, fontWeight: 700, cursor: "pointer",
            }}
          >
            Chamar no WhatsApp
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 11.5, opacity: 0.4, paddingBottom: 18 }}>
          Criado com Social Mini Sites
        </p>

        {/* BOTÃO FLUTUANTE WHATSAPP */}
        {interactive && (
          <button
            type="button"
            onClick={() => fire("whatsapp", waLink(site.company.whatsapp, site.company.whatsappMessage))}
            style={{
              position: "fixed", bottom: 18, right: 18, width: 54, height: 54,
              borderRadius: 999, background: "#1EA956", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 18px rgba(0,0,0,0.25)", cursor: "pointer", zIndex: 40,
            }}
            aria-label="Falar no WhatsApp"
          >
            <MessageCircle size={24} color="#fff" />
          </button>
        )}

        {/* LIGHTBOX */}
        {lightbox !== null && site.gallery[lightbox] && (
          <div
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 50,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              style={{ position: "absolute", top: 16, right: 16, color: "#fff", background: "transparent", border: "none", cursor: "pointer" }}
              aria-label="Fechar"
            >
              <X size={26} />
            </button>
            {lightbox > 0 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
                style={{ position: "absolute", left: 10, color: "#fff", background: "transparent", border: "none", cursor: "pointer" }}
                aria-label="Anterior"
              >
                <ChevronLeft size={30} />
              </button>
            )}
            <img
              src={site.gallery[lightbox].url}
              alt=""
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "88%", maxHeight: "78%", objectFit: "contain", borderRadius: 8 }}
            />
            {lightbox < site.gallery.length - 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
                style={{ position: "absolute", right: 10, color: "#fff", background: "transparent", border: "none", cursor: "pointer" }}
                aria-label="Próxima"
              >
                <ChevronRight size={30} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function socialBtn(color: string): React.CSSProperties {
  return {
    width: 42, height: 42, borderRadius: 999, border: `1px solid ${color}22`,
    background: "transparent", display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer", color,
  };
}