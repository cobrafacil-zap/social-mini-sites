import type { Site } from "./types";
import { SEEDS } from "./seed";
import { MODEL_BY_LAYOUT, isLayoutKey, type LayoutKey } from "./models";

const PREVIEW_COVER: Partial<Record<LayoutKey, string>> = {
  "store-urban": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80",
  "service-premium": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
  corporate: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
};

/** Imagens extras para a prévia demonstrar a galeria e as seções completas. */
const PREVIEW_GALLERY: Partial<Record<LayoutKey, string[]>> = {
  "boutique-elegante": [
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&q=80",
  ],
  "store-urban": [
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&q=80",
  ],
  "service-technical": [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80",
    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=700&q=80",
  ],
  "service-premium": [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=700&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=80",
  ],
  "health-wellness": [
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=700&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80",
  ],
  corporate: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=700&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80",
  ],
};

/**
 * Site de demonstração para o seletor de modelos e para as miniaturas.
 * Usa o seed real do segmento + a paleta do modelo escolhido, então a
 * miniatura mostra estrutura E cores reais daquele layout.
 */
export function demoSiteForLayout(layout: string): Site {
  const key: LayoutKey = isLayoutKey(layout) ? layout : "restaurant-classic";
  const model = MODEL_BY_LAYOUT[key];
  const seed = SEEDS[model.template];
  const company = { ...seed.company };
  const baseGallery =
    key === "service-premium" || key === "corporate" ? [] : seed.gallery;

  // A prévia não deve começar com o grande hero vazio só porque o exemplo
  // original não tinha capa cadastrada. Usa fotos do próprio segmento.
  company.coverUrl =
    company.coverUrl || PREVIEW_COVER[key] || baseGallery[0]?.url || seed.gallery[0]?.url || "";

  // Os dois modelos compartilham o segmento `servicos`, mas a prévia precisa
  // deixar evidente a diferença entre o técnico e o premium.
  if (key === "service-premium") {
    company.name = "Ateliê Lume";
    company.category = "Arquitetura e interiores";
    company.slogan = "Interiores com identidade, propósito e permanência.";
    company.shortDesc = "Projetos de interiores pensados para traduzir o jeito de viver de cada pessoa.";
    company.history = "Um estúdio de arquitetura dedicado a criar espaços acolhedores, funcionais e atemporais.";
  } else if (key === "corporate") {
    company.name = "Núcleo Consultoria";
    company.category = "Consultoria empresarial";
    company.slogan = "Estratégia e clareza para decisões melhores.";
    company.shortDesc = "Apoiamos empresas com planejamento, gestão e soluções sob medida.";
    company.history = "Uma equipe multidisciplinar para acompanhar empresas em decisões importantes e crescimento sustentável.";
  } else if (key === "store-urban") {
    company.name = "Distrito 44";
    company.category = "Streetwear independente";
    company.slogan = "Peças para quem faz do seu jeito.";
  }

  const extraGallery = (PREVIEW_GALLERY[key] ?? []).map((url, index) => ({
    id: `demo-${key}-${index + 1}`,
    url,
  }));

  return {
    id: `demo-${key}`,
    slug: model.label.toLowerCase().replace(/\s+/g, "-"),
    status: "draft",
    template: model.template,
    company,
    location: { ...seed.location },
    hours: { ...seed.hours },
    gallery: [...baseGallery, ...extraGallery],
    buttons: [...seed.buttons],
    customization: { ...model.palette, layout: key },
    createdAt: 0,
    updatedAt: 0,
  };
}
