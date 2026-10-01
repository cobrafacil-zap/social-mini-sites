"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Customization, EventType, Site } from "@/lib/types";
import { fullAddress, mapsEmbed, mapsLink, waLink, externalUrl, instaUrl } from "@/lib/links";
import { isOpenNow, todayIndex, DAYS } from "@/lib/hours";
import { radiusFor } from "@/lib/templates";
import { resolveLayout } from "@/lib/models";

export { resolveLayout };

/* ============================================================
   Contexto compartilhado pelos 8 layouts
   ============================================================ */

export type LayoutCtx = {
  site: Site;
  c: Customization;
  radius: number;
  open: boolean;
  now: Date;
  interactive: boolean;
  preview: boolean;
  /** registra evento + abre link externo */
  go: (type: EventType, url?: string) => void;
  wa: string;
};

const Ctx = createContext<LayoutCtx | null>(null);

export function useLayout(): LayoutCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLayout precisa estar dentro de <LayoutProvider>");
  return v;
}

export function LayoutProvider({
  site, interactive, onEvent, preview, children,
}: {
  site: Site;
  interactive: boolean;
  onEvent: (t: EventType) => void;
  preview?: boolean;
  children: ReactNode;
}) {
  const [now] = useState(() => new Date());
  const c = site.customization;

  const ctx = useMemo<LayoutCtx>(() => {
    const wa = waLink(site.company.whatsapp, site.company.whatsappMessage);
    return {
      site,
      c,
      radius: radiusFor(c.buttonStyle),
      open: isOpenNow(site.hours, now),
      now,
      interactive,
      preview: !!preview,
      wa,
      go(type, url) {
        if (!interactive) {
          if (url && preview) window.open(url, "_blank", "noopener,noreferrer");
          return;
        }
        onEvent(type);
        if (url) window.open(url, "_blank", "noopener,noreferrer");
      },
    };
  }, [site, c, interactive, preview, onEvent, now]);

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}

export function Cover({
  src, position, className = "", imgClassName = "",
}: { src?: string; position?: string; className?: string; imgClassName?: string }) {
  const { c } = useLayout();
  if (!src) {
    return <div className={className} style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <div className={className} style={{ overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={`h-full w-full object-cover ${imgClassName}`}
        style={{ objectPosition: position || "50% 50%" }}
      />
    </div>
  );
}

export function Logo({ src, size = 64, radius }: { src?: string; size?: number; radius?: number }) {
  if (!src) return null;
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden bg-white"
      style={{ width: size, height: size, borderRadius: radius ?? Math.round(size * 0.25) }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-contain p-1" />
    </span>
  );
}

export function OpenBadge({ className = "" }: { className?: string }) {
  const { open } = useLayout();
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${className}`}
      style={{ color: open ? "#0E8F4F" : "#9C3B31" }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: open ? "#0E8F4F" : "#9C3B31" }}
        aria-hidden="true"
      />
      {open ? "Aberto agora" : "Fechado agora"}
    </span>
  );
}

export function HoursTable({ compact = false }: { compact?: boolean }) {
  const { site } = useLayout();
  return (
    <ul className={compact ? "space-y-1" : "divide-y"}>
      {DAYS.map((d, i) => {
        const h = site.hours[d.key];
        const today = i === todayIndex(new Date());
        return (
          <li
            key={d.key}
            className="flex items-center justify-between gap-3 text-[13px]"
            style={{
              padding: compact ? "2px 0" : "9px 0",
              fontWeight: today ? 700 : 400,
            }}
          >
            <span style={{ opacity: today ? 1 : 0.62, textTransform: "capitalize" }}>{d.label}</span>
            <span style={{ opacity: h.closed ? 0.42 : 0.85 }} className="tabular-nums">
              {h.closed ? "Fechado" : `${h.open} – ${h.close}`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function LocationBlock({ actionLabel = "Como chegar" }: { actionLabel?: string }) {
  const { site, go, radius } = useLayout();
  const addr = fullAddress(site.location);
  if (!addr) return null;
  const mapRadius = Math.max(10, radius * 0.6);
  return (
    <div>
      <p className="text-[13.5px] leading-relaxed">{addr}</p>
      {site.company.phone && (
        <a
          href={`tel:${site.company.phone}`}
          onClick={() => go("telefone")}
          className="mt-1.5 inline-block text-[13.5px] font-semibold no-underline hover:underline"
          style={{ color: site.customization.primary }}
        >
          {site.company.phone}
        </a>
      )}
      <div className="mt-3 overflow-hidden" style={{ borderRadius: mapRadius, height: 170 }}>
        <iframe
          title="mapa"
          src={mapsEmbed(site.location)}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
        />
      </div>
      <a
        href={mapsLink(site.location)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => go("comoChegar")}
        className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 border px-4 py-2.5 text-[13px] font-semibold no-underline"
        style={{ borderRadius: radius, borderColor: `${site.customization.text}22` }}
      >
        {actionLabel}
      </a>
    </div>
  );
}

export function SocialRow({ size = 42 }: { size?: number }) {
  const { site, go } = useLayout();
  const { instagram, facebook, website } = site.company;
  if (!instagram && !facebook && !website) return null;
  const items = [
    instagram && { key: "ig", label: "Instagram", href: instaUrl(instagram), type: "instagram" as const, text: "IG" },
    facebook && { key: "fb", label: "Facebook", href: externalUrl(facebook), type: "outro" as const, text: "f" },
    website && { key: "web", label: "Site", href: externalUrl(website), type: "outro" as const, text: "↗" },
  ].filter(Boolean) as { key: string; label: string; href: string; type: "instagram" | "outro"; text: string }[];

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((it) => (
        <li key={it.key}>
          <a
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={it.label}
            onClick={() => go(it.type)}
            className="flex items-center justify-center border text-[12px] font-bold no-underline transition duration-150 hover:opacity-80"
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: `${site.customization.text}22`,
              color: site.customization.primary,
            }}
          >
            {it.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Hero simples de galeria com lightbox — só use onde fizer sentido no layout. */
export function Gallery({
  className = "",
  imageClassName = "",
  aspect = "aspect-square",
}: {
  className?: string;
  imageClassName?: string;
  aspect?: string;
}) {
  const { site, interactive } = useLayout();
  const [open, setOpen] = useState<number | null>(null);

  if (site.gallery.length === 0) return null;

  return (
    <>
      <ul className={className}>
        {site.gallery.map((g, i) => (
          <li key={g.id} className={aspect}>
            <button
              type="button"
              onClick={() => (interactive ? setOpen(i) : undefined)}
              aria-label={`Ampliar foto ${i + 1}`}
              className="h-full w-full overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.url}
                alt=""
                loading="lazy"
                className={`h-full w-full object-cover transition duration-300 ${interactive ? "hover:scale-[1.04]" : ""} ${imageClassName}`}
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && site.gallery[open] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setOpen(null)}
          role="dialog"
          aria-label="Foto ampliada"
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 border-0 bg-transparent text-[26px] text-white"
            aria-label="Fechar"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={site.gallery[open].url}
            alt=""
            className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
          />
        </div>
      )}
    </>
  );
}