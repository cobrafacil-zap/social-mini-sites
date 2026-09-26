import { createClient } from "@/lib/supabase/server";
import { rowToSite } from "@/lib/mappers";
import { siteHealth, suggestionsFor, type Suggestion } from "@/lib/siteHealth";
import { DashboardView } from "@/components/admin/dashboard/DashboardView";
import type { DashData, DashSite, DayStat, RangeKey } from "@/components/admin/dashboard/types";
import type { SiteRow, EventRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

const WINDOW = 90; // maior janela suportada pelos filtros do gráfico

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "smdigtal.com").toLowerCase();

  const [{ data: sites }, { data: events }] = await Promise.all([
    supabase.from("sites").select("*").order("updated_at", { ascending: false }),
    supabase
      .from("events")
      .select("site_id, event_type, created_at")
      .order("created_at", { ascending: false })
      .limit(5000),
  ]);

  const list = (sites ?? []) as SiteRow[];
  const eventList = (events ?? []) as Pick<EventRow, "site_id" | "event_type" | "created_at">[];

  const now = Date.now();
  const dayMs = 86_400_000;
  const startOfToday = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  })();

  // séries por janela: chaves = dia local (YYYY-M-D)
  const buckets: Record<RangeKey, { views: number[]; whatsapp: number[]; keys: string[] }> = {
    "7": { views: [], whatsapp: [], keys: [] },
    "30": { views: [], whatsapp: [], keys: [] },
    "90": { views: [], whatsapp: [], keys: [] },
  };
  for (const k of Object.keys(buckets) as RangeKey[]) {
    for (let i = WINDOW - 1; i >= 0; i--) {
      const d = new Date(now - i * dayMs);
      buckets[k].views.push(0);
      buckets[k].whatsapp.push(0);
      buckets[k].keys.push(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);
    }
  }
  const index = new Map<string, number>();
  buckets["90"].keys.forEach((k, i) => index.set(k, i));

  // agregação por site
  const perSite = new Map<string, { views: number; whatsapp: number; views7: number; whatsapp7: number; viewsPrev7: number }>();
  const activity: DashData["activity"] = [];
  const nameById: Record<string, string> = {};

  list.forEach((s) => {
    const c = (s.company ?? {}) as { name?: string };
    nameById[s.id] = c.name || "(sem nome)";
    perSite.set(s.id, { views: 0, whatsapp: 0, views7: 0, whatsapp7: 0, viewsPrev7: 0 });
  });

  for (const e of eventList) {
    const at = new Date(e.created_at).getTime();
    const i = index.get(`${new Date(at).getFullYear()}-${new Date(at).getMonth() + 1}-${new Date(at).getDate()}`);
    if (i !== undefined) {
      if (e.event_type === "view") {
        buckets["90"].views[i]!++;
        buckets["30"].views[i]!++;
        buckets["7"].views[i]!++;
      }
      if (e.event_type === "whatsapp") {
        buckets["90"].whatsapp[i]!++;
        buckets["30"].whatsapp[i]!++;
        buckets["7"].whatsapp[i]!++;
      }
    }

    const agg = perSite.get(e.site_id);
    if (agg) {
      if (e.event_type === "view") {
        agg.views++;
        if (at >= now - 7 * dayMs) agg.views7++;
        if (at >= now - 14 * dayMs && at < now - 7 * dayMs) agg.viewsPrev7++;
      }
      if (e.event_type === "whatsapp") {
        agg.whatsapp++;
        if (at >= now - 7 * dayMs) agg.whatsapp7++;
      }
    }

    if (e.event_type !== "view" || at >= startOfToday) {
      activity.push({
        siteId: e.site_id,
        siteName: nameById[e.site_id] ?? "Cliente",
        type: e.event_type,
        at,
      });
    }
  }

  const suggestions: Suggestion[] = [];
  const dashSites: DashSite[] = list.map((s) => {
    const site = rowToSite(s);
    const agg = perSite.get(s.id) ?? { views: 0, whatsapp: 0, views7: 0, whatsapp7: 0, viewsPrev7: 0 };
    suggestions.push(...suggestionsFor(site));
    return {
      id: s.id,
      name: nameById[s.id]!,
      slug: s.slug,
      domain: `${s.slug}.${root}`,
      url: `https://${s.slug}.${root}`,
      status: s.status,
      template: s.template,
      category: site.company.category || "",
      logoUrl: site.company.logoUrl,
      coverUrl: site.company.coverUrl,
      coverPosition: site.company.coverPosition,
      updatedAt: new Date(s.updated_at).getTime(),
      views: agg.views,
      whatsapp: agg.whatsapp,
      views7: agg.views7,
      whatsapp7: agg.whatsapp7,
      viewsPrev7: agg.viewsPrev7,
      health: siteHealth(site),
    };
  });

  const sevRank: Record<Suggestion["severity"], number> = { high: 0, mid: 1, low: 2 };
  suggestions.sort((a, b) => sevRank[a.severity] - sevRank[b.severity]);

  const series = (k: RangeKey, days: number): DayStat[] => {
    const out: DayStat[] = [];
    for (let i = WINDOW - days; i < WINDOW; i++) {
      out.push({ views: buckets[k].views[i] ?? 0, whatsapp: buckets[k].whatsapp[i] ?? 0 });
    }
    return out;
  };

  const data: DashData = {
    sites: dashSites,
    series: { "7": series("7", 7), "30": series("30", 30), "90": series("90", 90) },
    activity,
    generatedAt: now,
  };

  return <DashboardView data={data} suggestions={suggestions} />;
}
