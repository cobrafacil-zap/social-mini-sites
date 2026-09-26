import type { Site, Company, Location, Hours, Customization } from "./types";
import { DEFAULT_COMPANY, DEFAULT_CUSTOMIZATION } from "./types";

/**
 * "Configuração do mini site" — checklist calculado a partir de campos reais.
 * Nada aqui é subjetivo: cada ponto é um campo/condição verificável.
 * Se mudar o modelo de dados, atualize este arquivo.
 */

export type HealthPoint = { label: string; done: boolean };
export type HealthItem = {
  key: string;
  label: string;
  done: boolean;
  points: HealthPoint[];
  detail?: string;
};
export type Health = {
  items: HealthItem[];
  percent: number;
  doneCount: number;
  total: number;
};

const GALLERY_TARGET = 8;
const MIN_OPEN_DAYS = 5;

const has = (v: unknown): boolean => typeof v === "string" && v.trim().length > 0;

function companyItems(c: Company): HealthItem[] {
  return [
    {
      key: "empresa",
      label: "Empresa",
      done: has(c.name) && has(c.category),
      points: [
        { label: "Nome", done: has(c.name) },
        { label: "Categoria", done: has(c.category) },
        { label: "Slogan", done: has(c.slogan) },
        { label: "Descrição curta", done: has(c.shortDesc) },
      ],
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      done: digits(c.whatsapp) >= 10,
      points: [
        { label: "Número", done: digits(c.whatsapp) >= 10 },
        { label: "Mensagem automática", done: has(c.whatsappMessage) },
      ],
    },
    {
      key: "redes",
      label: "Redes sociais",
      done: has(c.instagram) || has(c.facebook) || has(c.website),
      points: [
        { label: "Instagram", done: has(c.instagram) },
        { label: "Facebook", done: has(c.facebook) },
        { label: "Site", done: has(c.website) },
      ],
    },
  ];
}

function locationItem(l: Location): HealthItem {
  return {
    key: "localizacao",
    label: "Localização",
    done: has(l.address) && has(l.city) && has(l.state),
    points: [
      { label: "Endereço", done: has(l.address) },
      { label: "Cidade", done: has(l.city) },
      { label: "Estado", done: has(l.state) },
    ],
  };
}

function hoursItem(h: Hours): HealthItem {
  const open = Object.values(h).filter((d) => !d.closed).length;
  return {
    key: "horario",
    label: "Horários",
    done: open >= MIN_OPEN_DAYS,
    detail: `${open}/7 dias`,
    points: Array.from({ length: 7 }, (_, i) => {
      const key = (["seg", "ter", "qua", "qui", "sex", "sab", "dom"] as const)[i]!;
      return { label: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][i]!, done: !h[key].closed };
    }),
  };
}

function galleryItem(site: Site): HealthItem {
  const n = site.gallery.length;
  return {
    key: "galeria",
    label: "Galeria",
    done: n >= GALLERY_TARGET,
    detail: `${n}/${GALLERY_TARGET}`,
    points: Array.from({ length: GALLERY_TARGET }, (_, i) => ({
      label: `Foto ${i + 1}`,
      done: i < n,
    })),
  };
}

function buttonsItem(site: Site): HealthItem {
  const usable = site.buttons.filter((b) => has(b.name) && has(b.link));
  return {
    key: "botoes",
    label: "Botões",
    done: usable.length > 0,
    detail: `${usable.length}`,
    points: site.buttons.length
      ? site.buttons.slice(0, 6).map((b) => ({ label: b.name || "Sem nome", done: has(b.name) && has(b.link) }))
      : [{ label: "Nenhum botão", done: false }],
  };
}

function visualItem(site: Site, c: Customization): HealthItem {
  const customPalette =
    c.primary !== DEFAULT_CUSTOMIZATION.primary ||
    c.secondary !== DEFAULT_CUSTOMIZATION.secondary ||
    c.background !== DEFAULT_CUSTOMIZATION.background ||
    c.text !== DEFAULT_CUSTOMIZATION.text;
  return {
    key: "personalizacao",
    label: "Personalização",
    done: customPalette && has(site.company.coverUrl),
    points: [
      { label: "Paleta de cores", done: customPalette },
      { label: "Foto de capa", done: has(site.company.coverUrl) },
      { label: "Logo", done: has(site.company.logoUrl) },
    ],
  };
}

function digits(v: string): number {
  return (v || "").replace(/\D/g, "").length;
}

export function siteHealth(site: Site): Health {
  const items: HealthItem[] = [
    ...companyItems(site.company),
    locationItem(site.location),
    hoursItem(site.hours),
    galleryItem(site),
    buttonsItem(site),
    visualItem(site, site.customization),
  ];

  let donePoints = 0;
  let totalPoints = 0;
  for (const it of items) {
    donePoints += it.points.filter((p) => p.done).length;
    totalPoints += it.points.length;
  }

  return {
    items,
    percent: totalPoints === 0 ? 0 : Math.round((donePoints / totalPoints) * 100),
    doneCount: items.filter((i) => i.done).length,
    total: items.length,
  };
}

/* ============================ Sugestões ============================ */

export type Suggestion = {
  id: string;
  siteId: string;
  siteName: string;
  message: string;
  severity: "high" | "mid" | "low";
};

export function suggestionsFor(site: Site): Suggestion[] {
  const out: Suggestion[] = [];
  const name = site.company.name || site.slug;
  const push = (message: string, severity: Suggestion["severity"]) =>
    out.push({
      id: `${site.id}:${message}`,
      siteId: site.id,
      siteName: name,
      message,
      severity,
    });

  if (digits(site.company.whatsapp) < 10) {
    push("O WhatsApp ainda não está configurado", "high");
  }
  if (site.status === "draft") {
    push(`Ainda está em rascunho — publique para receber acessos`, "high");
  }
  if (!has(site.company.logoUrl)) {
    push("Adicione a logo da empresa", "mid");
  }
  if (!has(site.company.coverUrl)) {
    push("Adicione uma foto de capa", "mid");
  }
  if (site.gallery.length > 0 && site.gallery.length < GALLERY_TARGET) {
    push(`Adicione mais fotos (${site.gallery.length}/${GALLERY_TARGET})`, "mid");
  }
  if (site.gallery.length === 0) {
    push("Adicione fotos à galeria", "mid");
  }
  if (!has(site.company.instagram) && !has(site.company.facebook)) {
    push("Configure o Instagram ou Facebook", "low");
  }
  if (!site.buttons.some((b) => has(b.name) && has(b.link))) {
    push("Adicione botões com link", "low");
  }
  if (Object.values(site.hours).every((d) => d.closed)) {
    push("Defina os horários de funcionamento", "mid");
  }
  if (!has(site.company.shortDesc)) {
    push("Escreva a descrição curta", "low");
  }

  return out;
}
