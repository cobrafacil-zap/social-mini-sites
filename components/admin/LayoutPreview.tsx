"use client";

import { useMemo } from "react";
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

  return (
    <div
      className={`relative ${full ? "h-full overflow-y-auto bg-white" : "overflow-hidden bg-[#EDEBE4]"} ${className}`}
      aria-hidden={!full}
    >
      <div
        className={full ? "mx-auto w-full" : "absolute left-1/2 top-0 origin-top"}
        style={full ? { width: "100%" } : { width: 390, transform: "translateX(-50%) scale(0.7)" }}
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
