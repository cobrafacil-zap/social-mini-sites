import type { Site } from "./types";

/**
 * Assistente de textos do editor — 100% local, sem nenhuma API externa.
 *
 * Gera sugestões a partir dos dados que já estão no site (nome, segmento,
 * cidade, serviços cadastrados). Não inventa informações: cada opção só
 * aparece quando os campos necessários estão preenchidos, e o texto final
 * sempre passa pela aprovação do usuário antes de ser aplicado.
 */

export type TextSuggestion = {
  /** Texto pronto para aplicar no campo. */
  text: string;
  /** Por que essa opção funciona — ajuda a escolher. */
  note: string;
};

type Ctx = {
  name: string;
  category: string;
  city: string;
  services: string[];
};

function ctxOf(site: Site): Ctx {
  return {
    name: (site.company.name || "").trim(),
    category: (site.company.category || "").trim(),
    city: (site.location.city || "").trim(),
    services: site.buttons
      .map((b) => (b.name || "").trim())
      .filter(Boolean)
      .slice(0, 3),
  };
}

/** Ação típica do visitante, conforme o segmento do site. */
function visitorAction(template: Site["template"]): string {
  switch (template) {
    case "restaurante":
      return "fazer uma reserva";
    case "loja":
      return "saber mais sobre um produto";
    case "servicos":
      return "pedir um orçamento";
    case "profissional":
      return "agendar um horário";
  }
}

/** Benefício curto por segmento, usado como matéria-prima do slogan. */
function segmentBenefit(template: Site["template"]): string {
  switch (template) {
    case "restaurante":
      return "sabor que reúne quem você ama";
    case "loja":
      return "peças que combinam com você";
    case "servicos":
      return "orçamento rápido e serviço garantido";
    case "profissional":
      return "atendimento que respeita o seu tempo";
  }
}

/** 3 opções de slogan — ou menos, se faltarem dados. */
export function suggestSlogans(site: Site): TextSuggestion[] {
  const { name, category, city } = ctxOf(site);
  const benefit = segmentBenefit(site.template);
  const out: TextSuggestion[] = [];

  if (category && city) {
    out.push({
      text: `${cap(category)} em ${city}: ${benefit}.`,
      note: "Direto e com cidade — ajuda quem procura no Google.",
    });
  }
  if (name) {
    out.push({
      text: `${name}: ${benefit}.`,
      note: "Reforça a marca junto com o benefício principal.",
    });
  }
  if (category) {
    out.push({
      text: `Seu ${lower(category)} de confiança${city ? ` em ${city}` : ""}.`,
      note: "Tom acolhedor, bom para negócios de bairro.",
    });
  }
  return out.slice(0, 3);
}

/** 2–3 descrições curtas montadas com categoria, serviços e cidade. */
export function suggestShortDescs(site: Site): TextSuggestion[] {
  const { category, city, services } = ctxOf(site);
  const out: TextSuggestion[] = [];
  const serviceList = services.join(", ").toLowerCase();

  if (category && serviceList) {
    const text = `${cap(category)}${city ? ` em ${city}` : ""}: ${serviceList}. Chame no WhatsApp.`;
    out.push({
      text,
      note: `${text.length} caracteres — aparece bem no Google e no compartilhamento.`,
    });
  }
  if (category && city) {
    out.push({
      text: `${cap(category)} em ${city} com atendimento rápido pelo WhatsApp.`,
      note: "Curta e com chamada para ação.",
    });
  }
  if (serviceList) {
    out.push({
      text: `${cap(serviceList)} e muito mais. Fale com a gente pelo WhatsApp.`,
      note: "Destaca os serviços cadastrados no site.",
    });
  }
  return out.slice(0, 3);
}

/** Mensagens prontas para o botão do WhatsApp. */
export function suggestWhatsappMessages(site: Site): TextSuggestion[] {
  const { name } = ctxOf(site);
  const action = visitorAction(site.template);
  if (!name) return [];
  return [
    {
      text: `Olá! Vi o site da ${name} e gostaria de ${action}.`,
      note: "Padrão — o visitante só completa os detalhes.",
    },
    {
      text: `Oi, tudo bem? Vim pelo site da ${name} e queria ${action}!`,
      note: "Tom mais informal, bom para comércio local.",
    },
  ];
}

/**
 * Pequenos acertos de revisão no texto "Sobre": espaços, pontuação e
 * maiúsculas. Preserva os parágrafos. Devolve `null` quando já está tudo
 * certo.
 */
export function polishHistory(raw: string): { text: string; changes: string[] } | null {
  const changes: string[] = [];
  let text = (raw || "").replace(/\r/g, "");

  const collapsed = text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  if (collapsed !== text) {
    changes.push("Espaços e quebras de linha ajustados");
    text = collapsed;
  }
  if (!text) return null;

  let capitalized = false;
  // Se o próximo trecho deve começar com maiúscula: sim no início do texto
  // e depois de quebra de parágrafo; no meio da frase, só depois de ponto,
  // interrogação etc. Quebra de linha simples preserva o estado anterior.
  let capNext = true;
  const fixed = text
    .split(/(\n+)/)
    .map((token) => {
      if (/^\n+$/.test(token)) {
        if (token.length > 1) capNext = true;
        // Quebra simples vira espaço; quebra dupla separa parágrafos.
        return token.length > 1 ? "\n\n" : " ";
      }
      const parts = token.match(/[^.!?…]+[.!?…]+["”']?|[^.!?…]+$/g) ?? [token];
      const clean = parts.map((s) => s.trim()).filter(Boolean);
      const done = clean.map((s, i) => {
        if (i > 0 || capNext) {
          const next = s.charAt(0).toUpperCase() + s.slice(1);
          if (next !== s) capitalized = true;
          return next;
        }
        return s;
      });
      const last = clean[clean.length - 1] ?? "";
      capNext = /[.!?…]["”']?$/.test(last);
      return done.join(" ");
    })
    .join("")
    .trim();

  if (fixed !== text) {
    if (capitalized) changes.push("Inícios de frase com maiúscula");
    else changes.push("Quebras de linha organizadas");
    text = fixed;
  }

  if (!/[.!?…]["”']?$/.test(text)) {
    changes.push("Ponto final adicionado");
    text = `${text}.`;
  }

  if (changes.length === 0) return null;
  return { text, changes };
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function lower(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
