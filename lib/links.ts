import type { Location } from "./types";

export function fullAddress(loc: Location): string {
  return [loc.address, loc.number, loc.neighborhood, loc.city, loc.state, loc.zip]
    .filter(Boolean)
    .join(", ");
}

export function mapsLink(loc: Location): string {
  const q = loc.mapsQuery || fullAddress(loc);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function mapsEmbed(loc: Location): string {
  const q = loc.mapsQuery || fullAddress(loc);
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
}

export function waLink(whatsapp: string, message?: string): string {
  const digits = (whatsapp || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message || "")}`;
}

export function externalUrl(v: string): string {
  if (!v) return "";
  if (v.startsWith("http")) return v;
  return `https://${v}`;
}

export function instaUrl(v: string): string {
  if (!v) return "";
  if (v.startsWith("http")) return v;
  return `https://instagram.com/${v.replace(/^@/, "")}`;
}