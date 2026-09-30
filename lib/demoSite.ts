import type { Site } from "./types";
import { SEEDS } from "./seed";
import { MODEL_BY_LAYOUT, isLayoutKey, type LayoutKey } from "./models";

/**
 * Site de demonstração para o seletor de modelos e para as miniaturas.
 * Usa o seed real do segmento + a paleta do modelo escolhido, então a
 * miniatura mostra estrutura E cores reais daquele layout.
 */
export function demoSiteForLayout(layout: string): Site {
  const key: LayoutKey = isLayoutKey(layout) ? layout : "restaurant-classic";
  const model = MODEL_BY_LAYOUT[key];
  const seed = SEEDS[model.template];

  return {
    id: `demo-${key}`,
    slug: model.label.toLowerCase().replace(/\s+/g, "-"),
    status: "draft",
    template: model.template,
    company: { ...seed.company },
    location: { ...seed.location },
    hours: { ...seed.hours },
    gallery: [...seed.gallery],
    buttons: [...seed.buttons],
    customization: { ...model.palette, layout: key },
    createdAt: 0,
    updatedAt: 0,
  };
}