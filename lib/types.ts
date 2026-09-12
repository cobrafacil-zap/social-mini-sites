// Tipos que espelham a tabela public.sites do Supabase.

export type Template = "restaurante" | "loja" | "servicos" | "profissional";
export type Status = "draft" | "published" | "disabled";
export type ButtonStyle = "rounded" | "pill" | "square";
export type IconName =
  | "whatsapp" | "map" | "phone" | "instagram" | "facebook" | "globe"
  | "menu" | "calendar" | "tag" | "cart" | "briefcase" | "image"
  | "star" | "bag" | "shoppingBag";

export type Company = {
  name: string;
  category: string;
  slogan: string;
  shortDesc: string;
  history: string;
  logoUrl: string;
  coverUrl: string;
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  instagram: string;
  facebook: string;
  website: string;
  email: string;
};

export type Location = {
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  mapsQuery: string;
};

export type DayKey = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";
export type DayHours = { open: string; close: string; closed: boolean };
export type Hours = Record<DayKey, DayHours>;

export type GalleryItem = { id: string; url: string };
export type Button = { id: string; name: string; icon: IconName; link: string; order: number };

export type Customization = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  buttonStyle: ButtonStyle;
};

export type Site = {
  id: string;
  slug: string;
  status: Status;
  template: Template;
  company: Company;
  location: Location;
  hours: Hours;
  gallery: GalleryItem[];
  buttons: Button[];
  customization: Customization;
  createdAt: number;
  updatedAt: number;
};

export type EventType =
  | "view" | "whatsapp" | "instagram" | "comoChegar" | "telefone" | "outro";

export const DEFAULT_COMPANY: Company = {
  name: "",
  category: "",
  slogan: "",
  shortDesc: "",
  history: "",
  logoUrl: "",
  coverUrl: "",
  phone: "",
  whatsapp: "",
  whatsappMessage: "Olá! Encontrei vocês pelo mini site e gostaria de mais informações.",
  instagram: "",
  facebook: "",
  website: "",
  email: "",
};

export const DEFAULT_LOCATION: Location = {
  address: "", number: "", neighborhood: "", city: "", state: "", zip: "", mapsQuery: "",
};

export const DEFAULT_HOURS: Hours = {
  seg: { open: "08:00", close: "18:00", closed: false },
  ter: { open: "08:00", close: "18:00", closed: false },
  qua: { open: "08:00", close: "18:00", closed: false },
  qui: { open: "08:00", close: "18:00", closed: false },
  sex: { open: "08:00", close: "18:00", closed: false },
  sab: { open: "08:00", close: "18:00", closed: false },
  dom: { open: "08:00", close: "18:00", closed: true  },
};

export const DEFAULT_CUSTOMIZATION: Customization = {
  primary: "#145C4B",
  secondary: "#D9A441",
  background: "#FFFFFF",
  text: "#1A1A1A",
  buttonStyle: "rounded",
};