"use client";

import type { ComponentType } from "react";
import type { EventType, Site } from "@/lib/types";
import { LayoutProvider, resolveLayout } from "./shared";
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
      <div className="mx-auto w-full max-w-[460px] overflow-hidden bg-white sm:max-w-[640px] sm:rounded-none xl:max-w-[1080px]">
        <SiteLayout site={site} preview={preview} />
      </div>
    </LayoutProvider>
  );
}

export { LayoutProvider, resolveLayout };