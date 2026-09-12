import {
  UtensilsCrossed, ShoppingBag, Briefcase, User,
  type LucideIcon,
} from "lucide-react";
import type { Template, IconName } from "./types";
import {
  MessageCircle, MapPin, Phone, Instagram, Facebook, Globe,
  Calendar, Tag, ShoppingCart, Image as ImageIcon, Star,
} from "lucide-react";

export const TEMPLATES: Record<Template, {
  label: string;
  icon: LucideIcon;
  defaultButtons: { name: string; icon: IconName; link: string }[];
  defaultCategory: string;
}> = {
  restaurante: {
    label: "Restaurante",
    icon: UtensilsCrossed,
    defaultCategory: "Restaurante",
    defaultButtons: [
      { name: "Ver cardápio", icon: "menu", link: "" },
      { name: "Reservar mesa", icon: "calendar", link: "" },
    ],
  },
  loja: {
    label: "Loja",
    icon: ShoppingBag,
    defaultCategory: "Loja",
    defaultButtons: [
      { name: "Ver catálogo", icon: "tag", link: "" },
      { name: "Comprar agora", icon: "cart", link: "" },
    ],
  },
  servicos: {
    label: "Prestador de serviços",
    icon: Briefcase,
    defaultCategory: "Prestador de serviços",
    defaultButtons: [
      { name: "Solicitar orçamento", icon: "briefcase", link: "" },
      { name: "Ver portfólio", icon: "image", link: "" },
    ],
  },
  profissional: {
    label: "Profissional autônomo",
    icon: User,
    defaultCategory: "Profissional autônomo",
    defaultButtons: [
      { name: "Agendar horário", icon: "calendar", link: "" },
      { name: "Conhecer serviços", icon: "star", link: "" },
    ],
  },
};

export const ICONS: Record<IconName, LucideIcon> = {
  whatsapp: MessageCircle,
  map: MapPin,
  phone: Phone,
  instagram: Instagram,
  facebook: Facebook,
  globe: Globe,
  menu: UtensilsCrossed,
  calendar: Calendar,
  tag: Tag,
  cart: ShoppingCart,
  briefcase: Briefcase,
  image: ImageIcon,
  star: Star,
  bag: ShoppingBag,
  shoppingBag: ShoppingBag,
};

export const ICON_OPTIONS = Object.keys(ICONS) as IconName[];

export function radiusFor(style: "rounded" | "pill" | "square"): number {
  if (style === "pill") return 999;
  if (style === "square") return 4;
  return 14;
}