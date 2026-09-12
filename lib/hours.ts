import type { DayKey, Hours } from "./types";

export const DAYS: { key: DayKey; label: string }[] = [
  { key: "seg", label: "Segunda" },
  { key: "ter", label: "Terça" },
  { key: "qua", label: "Quarta" },
  { key: "qui", label: "Quinta" },
  { key: "sex", label: "Sexta" },
  { key: "sab", label: "Sábado" },
  { key: "dom", label: "Domingo" },
];

export function isOpenNow(hours: Hours, now: Date = new Date()): boolean {
  const jsDay = now.getDay(); // 0 dom .. 6 sab
  const idx = (jsDay + 6) % 7; // 0 seg .. 6 dom
  const dayKey = DAYS[idx].key;
  const today = hours[dayKey];
  if (!today || today.closed) return false;
  const cur = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = (today.open || "00:00").split(":").map(Number);
  const [ch, cm] = (today.close || "00:00").split(":").map(Number);
  return cur >= oh * 60 + om && cur <= ch * 60 + cm;
}

export function todayIndex(now: Date = new Date()): number {
  const jsDay = now.getDay();
  return (jsDay + 6) % 7;
}