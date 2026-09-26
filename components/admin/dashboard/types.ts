import type { Health } from "@/lib/siteHealth";

export type RangeKey = "7" | "30" | "90";

export const RANGES: { key: RangeKey; label: string; days: number }[] = [
  { key: "7", label: "7 dias", days: 7 },
  { key: "30", label: "30 dias", days: 30 },
  { key: "90", label: "90 dias", days: 90 },
];

export type DayStat = { views: number; whatsapp: number };

export type ActivityEvent = {
  siteId: string;
  siteName: string;
  type: string;
  at: number;
};

export type DashSite = {
  id: string;
  name: string;
  slug: string;
  domain: string;
  url: string;
  status: string;
  template: string;
  category: string;
  logoUrl: string;
  coverUrl: string;
  coverPosition: string;
  updatedAt: number;
  views: number;
  whatsapp: number;
  views7: number;
  whatsapp7: number;
  viewsPrev7: number;
  health: Health;
};

export type DashData = {
  sites: DashSite[];
  series: Record<RangeKey, DayStat[]>;
  activity: ActivityEvent[];
  generatedAt: number;
};

/* ---------- helpers de leitura ---------- */

export function conversion(views: number, whatsapp: number): number {
  if (views <= 0) return 0;
  return Math.round((whatsapp / views) * 100);
}

export function deltaPct(current: number, previous: number): number | null {
  if (previous <= 0) return current > 0 ? null : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function sumSeries(series: DayStat[]) {
  return series.reduce(
    (acc, d) => {
      acc.views += d.views;
      acc.whatsapp += d.whatsapp;
      return acc;
    },
    { views: 0, whatsapp: 0 },
  );
}

const EVENT_LABEL: Record<string, string> = {
  view: "visualização",
  whatsapp: "clique no WhatsApp",
  instagram: "clique no Instagram",
  comoChegar: "clique em Como chegar",
  telefone: "clique em telefone",
  outro: "clique em um botão",
};

export function eventLabel(type: string, plural = false): string {
  const base = EVENT_LABEL[type] ?? "evento";
  if (!plural) return base;
  if (type === "view") return "visualizações";
  if (type === "whatsapp") return "cliques no WhatsApp";
  if (type === "instagram") return "cliques no Instagram";
  if (type === "comoChegar") return "cliques em Como chegar";
  if (type === "telefone") return "cliques em telefone";
  return "cliques em botões";
}

export function relativeTime(ts: number, now: number): string {
  const diff = Math.max(0, now - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  if (d === 1) return "ontem";
  if (d < 7) return `há ${d} dias`;
  if (d < 30) return `há ${Math.floor(d / 7)} sem`;
  return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

/** Agrupa eventos por (site, tipo) mantendo a contagem real. */
export type ActivityGroup = {
  key: string;
  siteId: string;
  siteName: string;
  type: string;
  count: number;
  lastAt: number;
};

export function groupActivity(events: ActivityEvent[]): ActivityGroup[] {
  const map = new Map<string, ActivityGroup>();
  for (const e of events) {
    const key = `${e.siteId}:${e.type}`;
    const g = map.get(key);
    if (g) {
      g.count += 1;
      g.lastAt = Math.max(g.lastAt, e.at);
    } else {
      map.set(key, {
        key,
        siteId: e.siteId,
        siteName: e.siteName,
        type: e.type,
        count: 1,
        lastAt: e.at,
      });
    }
  }
  return [...map.values()]
    .filter((g) => g.count > 1)
    .sort((a, b) => b.lastAt - a.lastAt);
}
