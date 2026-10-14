"use client";

import { useEffect, useRef, type ComponentType, type ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import type { EventType, Site } from "@/lib/types";
import { LayoutProvider, resolveLayout, useLayout } from "./shared";
import { RestaurantClassic } from "./RestaurantClassic";
import { RestaurantModern } from "./RestaurantModern";
import { BoutiqueElegant } from "./BoutiqueElegant";
import { StoreUrban } from "./StoreUrban";
import { ServiceTechnical } from "./ServiceTechnical";
import { ServicePremium } from "./ServicePremium";
import { HealthWellness } from "./HealthWellness";
import { Corporate } from "./Corporate";
import type { LayoutKey } from "@/lib/models";

const REGISTRY: Record<LayoutKey, ComponentType> = {
  "restaurant-classic": RestaurantClassic,
  "restaurant-modern": RestaurantModern,
  "boutique-elegante": BoutiqueElegant,
  "store-urban": StoreUrban,
  "service-technical": ServiceTechnical,
  "service-premium": ServicePremium,
  "health-wellness": HealthWellness,
  corporate: Corporate,
};

export const LAYOUT_KEYS = Object.keys(REGISTRY) as LayoutKey[];

/** Renderiza o layout correspondente ao site. Fallback: primeiro layout. */
export function SiteLayout({
  site, preview,
}: { site: Site; preview?: boolean }) {
  const key = resolveLayout(site);
  const Layout = REGISTRY[key] ?? RestaurantClassic;
  return <Layout />;
}

/** Envelope compartilhado: provider + shell responsivo. */
export function MiniSiteShell({
  site, interactive, onEvent, preview,
}: {
  site: Site;
  interactive: boolean;
  onEvent: (t: EventType) => void;
  preview?: boolean;
}) {
  return (
    <LayoutProvider site={site} interactive={interactive} onEvent={onEvent} preview={preview}>
      <div
        className="mini-site-public mx-auto w-full max-w-full overflow-hidden bg-white sm:max-w-[760px] lg:max-w-[960px] xl:max-w-[1080px]"
        data-layout={resolveLayout(site)}
      >
        <MotionSections enabled={!preview}>
          <SiteLayout site={site} preview={preview} />
        </MotionSections>
      </div>
      {!preview && <FloatingWhatsApp />}
    </LayoutProvider>
  );
}

/** Ação principal acessível sem rolar a página, em todos os modelos públicos. */
function FloatingWhatsApp() {
  const { site, wa, go } = useLayout();

  if (!site.company.whatsapp || !wa) return null;

  return (
    <a
      href={wa}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        // `go` já abre o link e registra o evento. Evita abrir duas abas pelo
        // comportamento padrão do anchor + window.open.
        event.preventDefault();
        go("whatsapp", wa);
      }}
      className="mini-site-whatsapp fixed z-[55] inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-[#1EA956] px-4 text-[13px] font-semibold text-white no-underline shadow-[0_8px_28px_-8px_rgba(30,169,86,.72)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#168D47] hover:shadow-lg active:scale-[0.97] focus-visible:outline-white"
      style={{
        bottom: "max(16px, calc(env(safe-area-inset-bottom) + 16px))",
        right: "max(16px, calc((100vw - 1080px) / 2 + 20px))",
      }}
      aria-label="Falar pelo WhatsApp"
      title="Falar pelo WhatsApp"
    >
      <MessageCircle size={21} strokeWidth={2.4} aria-hidden="true" />
      <span>WhatsApp</span>
    </a>
  );
}

/** Revela cada seção ao entrar na tela, sem afetar o modo de preview. */
function MotionSections({
  children,
  enabled,
}: {
  children: ReactNode;
  enabled: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const layout = ref.current.firstElementChild;
    if (!layout) return;

    const sections = Array.from(
      layout.querySelectorAll<HTMLElement>(":scope > section, :scope > footer")
    );

    sections.forEach((section) => {
      section.classList.add("mini-reveal");
      Array.from(section.children).forEach((child, index) => {
        if (!(child instanceof HTMLElement) || child.tagName === "STYLE") return;
        child.classList.add("mini-reveal-item");
        child.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 65}ms`);
      });
    });

    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -28px 0px" }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [enabled]);

  return (
    <div ref={ref} className={enabled ? "mini-site-motion" : undefined}>
      {children}
    </div>
  );
}

export { LayoutProvider, resolveLayout };
