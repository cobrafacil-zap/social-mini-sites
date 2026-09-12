import type { Site, Template } from "@/lib/types";
import {
  DEFAULT_COMPANY, DEFAULT_CUSTOMIZATION, DEFAULT_HOURS, DEFAULT_LOCATION,
} from "@/lib/types";

/**
 * Seeds prontos pra cada segmento, baseados nos mini-sites que existiam
 * no `index (1) (1).html` original. O admin escolhe o segmento em
 * `/admin/new` (igual antes) e, se marcar "preencher com exemplo", o
 * site nasce já com dados, capa, galeria, botões e horários prontos.
 *
 * Cada seed define só o que é específico do segmento; o resto vem
 * dos defaults em `lib/types.ts`.
 */

type SeedShape = Pick<Site, "company" | "location" | "hours" | "gallery" | "buttons" | "customization">;

const RESTAURANTE: SeedShape = {
  company: {
    ...DEFAULT_COMPANY,
    name: "Villa Itália",
    category: "Restaurante",
    slogan: "Sabor, tradição e bons momentos.",
    shortDesc: "Pizzas, porções e sabores especiais para compartilhar bons momentos.",
    history:
      "A Villa Itália é o lugar para quem ama boa comida e momentos especiais. Com um ambiente acolhedor, sabores preparados com carinho e opções para toda a família, buscamos transformar cada visita em uma experiência gostosa e inesquecível.",
    logoUrl: "",
    coverUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    phone: "(43) 99988-7766",
    whatsapp: "5543999887766",
    whatsappMessage: "Olá! Vi o cardápio no mini site da Villa Itália e gostaria de fazer uma reserva.",
    instagram: "villaitalia",
    facebook: "",
    website: "",
    email: "",
  },
  location: {
    address: "Av. Alberto Carazzai",
    number: "862",
    neighborhood: "Centro",
    city: "Cornélio Procópio",
    state: "PR",
    zip: "86300-000",
    mapsQuery: "Av. Alberto Carazzai, 862, Centro, Cornélio Procópio, PR",
  },
  hours: {
    seg: { open: "18:00", close: "23:00", closed: true  },
    ter: { open: "18:00", close: "23:00", closed: false },
    qua: { open: "18:00", close: "23:00", closed: false },
    qui: { open: "18:00", close: "23:00", closed: false },
    sex: { open: "18:00", close: "23:00", closed: false },
    sab: { open: "18:00", close: "23:00", closed: false },
    dom: { open: "18:00", close: "23:00", closed: false },
  },
  gallery: [
    { id: "img_seed_1", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80" },
    { id: "img_seed_2", url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80" },
    { id: "img_seed_3", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80" },
    { id: "img_seed_4", url: "https://images.unsplash.com/photo-1579684947550-22e945225d9e?w=600&q=80" },
    { id: "img_seed_5", url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80" },
  ],
  buttons: [
    { id: "btn_seed_1", name: "Ver cardápio",  icon: "menu",     link: "#cardapio",     order: 0 },
    { id: "btn_seed_2", name: "Reservar mesa", icon: "calendar", link: "#reservar",     order: 1 },
  ],
  customization: {
    primary: "#145C4B",     // verde-escuro da casa (igual ao CTA do modelo)
    secondary: "#1EA956",   // verde WhatsApp
    background: "#FFFFFF",
    text: "#1A1A1A",
    buttonStyle: "rounded",
  },
};

const LOJA: SeedShape = {
  company: {
    ...DEFAULT_COMPANY,
    name: "Boutique Flor de Lis",
    category: "Moda feminina",
    slogan: "Peças autorais com curadoria artesanal",
    shortDesc:
      "Roupas e acessórios femininos de marcas independentes, tecidos naturais e produção sob demanda.",
    history:
      "A Flor de Lis nasceu em 2015 do desejo de trazer para a cidade peças que fogem da moda rápida. Trabalhamos só com marcas que conhecem seus costureiros, tecidos que respeitam o meio ambiente e ateliês que pagam justo. Cada peça nossa tem história — da modelagem ao aviamento.",
    phone: "(43) 3344-1122",
    whatsapp: "5543988776655",
    whatsappMessage: "Olá! Vi uma peça no mini site da Flor de Lis e gostaria de saber mais.",
    instagram: "boutiqueflordelis",
    facebook: "boutiqueflordelis",
    website: "https://www.flordelis.com.br",
    email: "ola@flordelis.com.br",
  },
  location: {
    address: "Rua Pará", number: "888", neighborhood: "Centro",
    city: "Londrina", state: "PR", zip: "86010-100", mapsQuery: "Boutique Flor de Lis Londrina",
  },
  hours: {
    seg: { open: "10:00", close: "19:00", closed: false },
    ter: { open: "10:00", close: "19:00", closed: false },
    qua: { open: "10:00", close: "19:00", closed: false },
    qui: { open: "10:00", close: "19:00", closed: false },
    sex: { open: "10:00", close: "20:00", closed: false },
    sab: { open: "10:00", close: "15:00", closed: false },
    dom: { open: "10:00", close: "13:00", closed: true  },
  },
  gallery: [
    { id: "img_seed_1", url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" },
    { id: "img_seed_2", url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80" },
    { id: "img_seed_3", url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80" },
    { id: "img_seed_4", url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80" },
  ],
  buttons: [
    { id: "btn_seed_1", name: "Ver catálogo",  icon: "tag",   link: "https://www.flordelis.com.br/catalogo", order: 0 },
    { id: "btn_seed_2", name: "Comprar agora", icon: "cart",  link: "https://www.flordelis.com.br/loja",     order: 1 },
    { id: "btn_seed_3", name: "Lançamentos",   icon: "star",  link: "https://www.flordelis.com.br/novidades", order: 2 },
  ],
  customization: {
    primary: "#3B2A4A",     // roxo escuro
    secondary: "#D4A5C4",   // rosa antigo
    background: "#FAF6F2",
    text: "#1A1410",
    buttonStyle: "pill",
  },
};

const SERVICOS: SeedShape = {
  company: {
    ...DEFAULT_COMPANY,
    name: "LVR Eletricista",
    category: "Eletricista residencial e comercial",
    slogan: "Atendimento 24h para emergências elétricas",
    shortDesc:
      "Instalações, manutenção preventiva e corretiva, projetos elétricos residenciais e comerciais com ART.",
    history:
      "Mais de 15 anos no mercado, com 2.000+ clientes atendidos. Equipe uniformizada, orçamento sem compromisso e garantia de 90 dias em todos os serviços. Atendemos Londrina e região metropolitana com prazo de até 1h para emergências.",
    phone: "(43) 99988-7766",
    whatsapp: "554399887766",
    whatsappMessage: "Olá! Preciso de um orçamento para serviço elétrico.",
    instagram: "lvreletricista",
    facebook: "lvr.eletricista",
    website: "",
    email: "contato@lvreletricista.com.br",
  },
  location: {
    address: "Rua Sergipe", number: "500", neighborhood: "Centro",
    city: "Londrina", state: "PR", zip: "86010-300", mapsQuery: "LVR Eletricista Londrina",
  },
  hours: {
    seg: { open: "08:00", close: "18:00", closed: false },
    ter: { open: "08:00", close: "18:00", closed: false },
    qua: { open: "08:00", close: "18:00", closed: false },
    qui: { open: "08:00", close: "18:00", closed: false },
    sex: { open: "08:00", close: "18:00", closed: false },
    sab: { open: "08:00", close: "12:00", closed: false },
    dom: { open: "00:00", close: "23:59", closed: true  }, // plantão 24h só emergência
  },
  gallery: [
    { id: "img_seed_1", url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80" },
    { id: "img_seed_2", url: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=600&q=80" },
    { id: "img_seed_3", url: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80" },
  ],
  buttons: [
    { id: "btn_seed_1", name: "Solicitar orçamento", icon: "briefcase", link: "https://wa.me/554399887766?text=Olá! Preciso de um orçamento.", order: 0 },
    { id: "btn_seed_2", name: "Ver portfólio",       icon: "image",     link: "https://www.lvreletricista.com.br/portfolio", order: 1 },
    { id: "btn_seed_3", name: "Emergência 24h",      icon: "phone",     link: "tel:+554399887766",                       order: 2 },
  ],
  customization: {
    primary: "#0B3D91",     // azul corporativo
    secondary: "#FFB400",   // amarelo elétrico
    background: "#FFFFFF",
    text: "#0A0A0A",
    buttonStyle: "square",
  },
};

const PROFISSIONAL: SeedShape = {
  company: {
    ...DEFAULT_COMPANY,
    name: "Dra. Helena Costa",
    category: "Psicóloga clínica",
    slogan: "Atendimento presencial e online para adultos",
    shortDesc:
      "Psicoterapia cognitivo-comportamental para ansiedade, depressão, questões de relacionamento e autoestima.",
    history:
      "Sou psicóloga formada pela UEL, com especialização em TCC pelo Instituto Beck. Atendo há 8 anos em consultório próprio e online, com abordagem acolhedora e baseada em evidências. CRP 08/12345.",
    phone: "(43) 99911-2233",
    whatsapp: "5543999112233",
    whatsappMessage: "Olá! Gostaria de agendar uma sessão.",
    instagram: "dra.helenacosta",
    facebook: "",
    website: "https://www.drahelenacosta.com.br",
    email: "contato@drahelenacosta.com.br",
  },
  location: {
    address: "Av. JK", number: "2000", neighborhood: "Jardim Higienópolis",
    city: "Londrina", state: "PR", zip: "86010-200", mapsQuery: "Dra Helena Costa Psicóloga Londrina",
  },
  hours: {
    seg: { open: "08:00", close: "20:00", closed: false },
    ter: { open: "08:00", close: "20:00", closed: false },
    qua: { open: "08:00", close: "20:00", closed: false },
    qui: { open: "08:00", close: "20:00", closed: false },
    sex: { open: "08:00", close: "18:00", closed: false },
    sab: { open: "08:00", close: "12:00", closed: false },
    dom: { open: "00:00", close: "23:59", closed: true  },
  },
  gallery: [
    { id: "img_seed_1", url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80" },
    { id: "img_seed_2", url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80" },
  ],
  buttons: [
    { id: "btn_seed_1", name: "Agendar sessão",  icon: "calendar", link: "https://wa.me/5543999112233?text=Olá! Gostaria de agendar uma sessão.", order: 0 },
    { id: "btn_seed_2", name: "Conhecer serviços", icon: "star",   link: "https://www.drahelenacosta.com.br/servicos", order: 1 },
  ],
  customization: {
    primary: "#5B6F4A",     // verde sálvia
    secondary: "#E8B4A0",   // pêssego
    background: "#F8F5F0",
    text: "#1A1A1A",
    buttonStyle: "rounded",
  },
};

export const SEEDS: Record<Template, SeedShape> = {
  restaurante: RESTAURANTE,
  loja: LOJA,
  servicos: SERVICOS,
  profissional: PROFISSIONAL,
};

export function seedFor(template: Template): SeedShape {
  return SEEDS[template];
}
