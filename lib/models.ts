import type { ButtonStyle, Template } from "./types";

/**
 * Registro central dos 8 modelos do gerador.
 *
 * Cada modelo tem:
 *  - `template`  → mantém o valor gravado na coluna `sites.template` (4 valores, sem migração)
 *  - `layout`    → qual componente de layout renderiza o site (chave do registry em components/public/layouts)
 *  - `palette`   → cores aplicadas na criação
 *
 * O `layout` é persistido dentro de `customization` (JSONB), então trocar de
 * modelo não exige alteração de banco.
 */

export type LayoutKey =
  | "restaurant-classic"
  | "restaurant-modern"
  | "boutique-elegante"
  | "store-urban"
  | "service-technical"
  | "service-premium"
  | "health-wellness"
  | "corporate";

export type Palette = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  buttonStyle: ButtonStyle;
};

export type Model = {
  id: LayoutKey;
  /** id curto usado no formulário de criação */
  seed: string;
  label: string;
  tagline: string;
  profile: string;
  structure: string[];
  template: Template;
  palette: Palette;
};

export const MODELS: Model[] = [
  {
    id: "restaurant-classic",
    seed: "restaurant-classic",
    label: "Restaurante Clássico",
    tagline: "Elegante, acolhedor, tradicional",
    profile: "Pizzarias, restaurantes familiares, cantinas",
    structure: ["Hero gastronômico", "Mais pedidos", "Cardápio por categorias", "Galeria", "Barra de WhatsApp"],
    template: "restaurante",
    palette: { primary: "#9B1B30", secondary: "#E9C46A", background: "#FFF8F0", text: "#1A1A1A", buttonStyle: "rounded" },
  },
  {
    id: "restaurant-modern",
    seed: "restaurant-modern",
    label: "Restaurante Moderno",
    tagline: "Impactante, urbano, delivery",
    profile: "Hamburguerias, bares, comida jovem",
    structure: ["Hero dividido 2 colunas", "Oferta do dia", "Combos em cards", "Avaliações", "CTA fixo Pedir agora"],
    template: "restaurante",
    palette: { primary: "#111111", secondary: "#E30613", background: "#FFFFFF", text: "#111111", buttonStyle: "pill" },
  },
  {
    id: "boutique-elegante",
    seed: "boutique-elegante",
    label: "Loja Elegante",
    tagline: "Minimalista, editorial, sofisticado",
    profile: "Boutiques, moda feminina, joalherias",
    structure: ["Hero editorial", "Coleções em blocos", "Novidades", "Destaques", "CTA Falar com a loja"],
    template: "loja",
    palette: { primary: "#3B2A4A", secondary: "#D4A5C4", background: "#FAF6F2", text: "#1A1410", buttonStyle: "pill" },
  },
  {
    id: "store-urban",
    seed: "store-urban",
    label: "Loja Urbana",
    tagline: "Street, experimental, ousada",
    profile: "Streetwear, sneakers, moda jovem",
    structure: ["Hero fullscreen", "Banner de lançamento", "Grid assimétrico", "Drops", "CTA WhatsApp"],
    template: "loja",
    palette: { primary: "#0A0A0A", secondary: "#00E676", background: "#FFFFFF", text: "#0A0A0A", buttonStyle: "square" },
  },
  {
    id: "service-technical",
    seed: "service-technical",
    label: "Serviços Técnicos",
    tagline: "Objetiva, técnica, confiável",
    profile: "Eletricistas, oficinas, energia solar",
    structure: ["Hero com proposta de valor", "Lista de serviços", "Antes e depois", "Área atendida", "Orçamento"],
    template: "servicos",
    palette: { primary: "#0B3D91", secondary: "#FFB400", background: "#FFFFFF", text: "#0A0A0A", buttonStyle: "square" },
  },
  {
    id: "service-premium",
    seed: "service-premium",
    label: "Serviços Premium",
    tagline: "Luxuosa, limpa, exclusiva",
    profile: "Clínicas, estética, arquitetura",
    structure: ["Hero minimalista", "Apresentação", "Serviços individuais", "Galeria sofisticada", "Agendamento"],
    template: "servicos",
    palette: { primary: "#0A0A0A", secondary: "#D9A441", background: "#FFFBF5", text: "#1E1B2E", buttonStyle: "rounded" },
  },
  {
    id: "health-wellness",
    seed: "health-wellness",
    label: "Saúde e Bem-estar",
    tagline: "Acolhedora, leve, humana",
    profile: "Psicólogos, nutricionistas, terapeutas",
    structure: ["Apresentação humana", "Foto + texto", "Especialidades", "Para quem é", "FAQ", "Agendar"],
    template: "profissional",
    palette: { primary: "#5B6F4A", secondary: "#E8B4A0", background: "#F8F5F0", text: "#1A1A1A", buttonStyle: "rounded" },
  },
  {
    id: "corporate",
    seed: "corporate",
    label: "Corporativo",
    tagline: "Sólida, estruturada, B2B",
    profile: "Advocacia, contabilidade, consultoria",
    structure: ["Hero institucional", "Indicadores", "Áreas de atuação", "Sobre", "Diferenciais", "Contato"],
    template: "profissional",
    palette: { primary: "#0F2A44", secondary: "#C5A254", background: "#F8F6F1", text: "#0F172A", buttonStyle: "square" },
  },
];

export const MODEL_BY_SEED: Record<string, Model> = Object.fromEntries(
  MODELS.map((m) => [m.seed, m]),
);

export const MODEL_BY_LAYOUT: Record<LayoutKey, Model> = Object.fromEntries(
  MODELS.map((m) => [m.id, m]),
) as Record<LayoutKey, Model>;

/** Layout usado quando o site ainda não tem `customization.layout` gravado. */
export const LAYOUT_FALLBACK: Record<Template, LayoutKey> = {
  restaurante: "restaurant-classic",
  loja: "boutique-elegante",
  servicos: "service-technical",
  profissional: "health-wellness",
};

export function isLayoutKey(v: unknown): v is LayoutKey {
  return typeof v === "string" && MODELS.some((m) => m.id === v);
}
/**
 * Qual layout renderiza um site.
 * Usa `customization.layout` quando gravado; senão cai no padrão do segmento.
 * Mora em lib/ para ser usado tanto pelo admin quanto pelos layouts públicos.
 */
export function resolveLayout(site: {
  template: Template;
  customization: { layout?: string };
}): LayoutKey {
  const saved = site.customization.layout;
  if (isLayoutKey(saved)) return saved;
  return LAYOUT_FALLBACK[site.template] ?? "restaurant-classic";
}

/**
 * Aliases legados: versões antigas do formulário mandavam `modelId` com outro
 * nome. Mantidos para que links/formulários antigos continuem funcionando.
 */
const LEGACY_SEED: Record<string, LayoutKey> = {
  "villa-classico": "restaurant-classic",
  "burger-moderno": "restaurant-modern",
  "boutique-elegante": "boutique-elegante",
  "loja-urbana": "store-urban",
  "servico-tecnico": "service-technical",
  "servico-premium": "service-premium",
  "saude-bemestar": "health-wellness",
  "corporativo": "corporate",
};

/** Resolve um `modelId` (atual ou legado) para o modelo correspondente. */
export function modelBySeed(seed: string): Model | undefined {
  if (MODEL_BY_SEED[seed]) return MODEL_BY_SEED[seed];
  const layout = LEGACY_SEED[seed];
  return layout ? MODEL_BY_LAYOUT[layout] : undefined;
}
