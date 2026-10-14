"use client";

import { useMemo, useRef, useState } from "react";
import { LayoutProvider } from "@/components/public/layouts/shared";
import { RestaurantClassic } from "@/components/public/layouts/RestaurantClassic";
import { RestaurantModern } from "@/components/public/layouts/RestaurantModern";
import { BoutiqueElegant } from "@/components/public/layouts/BoutiqueElegant";
import { StoreUrban } from "@/components/public/layouts/StoreUrban";
import { ServiceTechnical } from "@/components/public/layouts/ServiceTechnical";
import { ServicePremium } from "@/components/public/layouts/ServicePremium";
import { HealthWellness } from "@/components/public/layouts/HealthWellness";
import { Corporate } from "@/components/public/layouts/Corporate";
import { demoSiteForLayout } from "@/lib/demoSite";
import type { LayoutKey } from "@/lib/models";

const REGISTRY = {
  "restaurant-classic": RestaurantClassic,
  "restaurant-modern": RestaurantModern,
  "boutique-elegante": BoutiqueElegant,
  "store-urban": StoreUrban,
  "service-technical": ServiceTechnical,
  "service-premium": ServicePremium,
  "health-wellness": HealthWellness,
  corporate: Corporate,
} as const;

/** Largura real do layout dentro da miniatura + escala aplicada. */
const CARD_WIDTH = 390;
const CARD_SCALE = 0.7;

/**
 * Miniatura real: renderiza o layout de verdade, com os dados do segmento,
 * dentro de um frame estreito escalado por CSS.
 */
export function LayoutPreview({
  layout,
  className = "",
  variant = "card",
}: {
  layout: LayoutKey;
  className?: string;
  variant?: "card" | "full";
}) {
  const site = useMemo(() => demoSiteForLayout(layout), [layout]);
  const Layout = REGISTRY[layout] ?? RestaurantClassic;
  const full = variant === "full";

  // Tour animado no hover (só na miniatura do cartão): percorre o site
  // inteiro dentro do frame, do topo ao rodapé, para ver o layout completo
  // antes de escolher. A distância é medida no conteúdo real, então funciona
  // para qualquer altura de página.
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const [tourMs, setTourMs] = useState(0);
  const touringRef = useRef(false);

  function startTour() {
    if (full || touringRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = frameRef.current;
    const content = contentRef.current;
    if (!frame || !content) return;
    const max = content.offsetHeight * CARD_SCALE - frame.clientHeight;
    if (max <= 0) return;
    touringRef.current = true;
    // Velocidade constante (~500px/s visuais), limitada para não demorar.
    setTourMs(Math.min(7000, Math.max(2500, (max / 500) * 1000)));
    setShift(max);
  }

  function stopTour() {
    if (!touringRef.current) return;
    touringRef.current = false;
    setTourMs(600);
    setShift(0);
  }

  return (
    <div
      ref={full ? undefined : frameRef}
      onMouseEnter={full ? undefined : startTour}
      onMouseLeave={full ? undefined : stopTour}
      className={`relative ${full ? "h-full overflow-y-auto bg-white" : "overflow-hidden bg-[#EDEBE4]"} ${className}`}
      aria-hidden={!full}
    >
      <div
        ref={full ? undefined : contentRef}
        className={full ? "mx-auto w-full" : "absolute left-1/2 top-0 origin-top"}
        style={
          full
            ? { width: "100%" }
            : {
                width: CARD_WIDTH,
                transform: `translateX(-50%) translateY(${-shift}px) scale(${CARD_SCALE})`,
                transition: tourMs > 0 ? `transform ${tourMs}ms ease-in-out` : undefined,
                willChange: "transform",
              }
        }
      >
        <div className="pointer-events-none select-none [&_*]:!pointer-events-none">
          <LayoutProvider site={site} interactive={false} onEvent={() => {}} preview={!full}>
            <div style={{ width: full ? "100%" : 390, background: "#fff" }}>
              <Layout />
            </div>
          </LayoutProvider>
        </div>
      </div>
    </div>
  );
}
