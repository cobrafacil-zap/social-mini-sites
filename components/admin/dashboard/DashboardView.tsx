"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Eye, CheckCircle2, Pencil, MessageCircle, Layers } from "lucide-react";
import { MetricCard, ConversionCard } from "./MetricCard";
import { PerformanceChart } from "./PerformanceChart";
import { SiteList } from "./SiteList";
import { HealthPanel } from "./HealthPanel";
import { SuggestionsPanel } from "./SuggestionsPanel";
import { ActivityPanel } from "./ActivityPanel";
import { TopSites } from "./TopSites";
import { deltaPct, type DashData, type RangeKey } from "./types";
import type { Suggestion } from "@/lib/siteHealth";

type StatusFilter = "published" | "draft" | null;

export function DashboardView({ data, suggestions }: { data: DashData; suggestions: Suggestion[] }) {
  const [range, setRange] = useState<RangeKey>("7");
  const [status, setStatus] = useState<StatusFilter>(null);
  const now = data.generatedAt;

  const totals = useMemo(() => {
    let views = 0, whatsapp = 0, published = 0, draft = 0;
    for (const s of data.sites) {
      views += s.views;
      whatsapp += s.whatsapp;
      if (s.status === "published") published++;
      if (s.status === "draft") draft++;
    }
    return {
      views, whatsapp, published, draft, total: data.sites.length,
    };
  }, [data.sites]);

  const views7 = data.sites.reduce((a, s) => a + s.views7, 0);
  const whatsapp7 = data.sites.reduce((a, s) => a + s.whatsapp7, 0);
  const viewsPrev7 = data.sites.reduce((a, s) => a + s.viewsPrev7, 0);

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 sm:py-8">
      <Header />

      {/* Métricas */}
      <section aria-label="Métricas" className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          label="Total de mini sites"
          value={totals.total}
          Icon={Layers}
          tone="brand"
          sub={`${totals.total - totals.draft} ativos`}
          onClick={() => setStatus(null)}
          active={status === null}
        />
        <MetricCard
          label="Publicados"
          value={totals.published}
          Icon={CheckCircle2}
          tone="ok"
          sub="no ar"
          onClick={() => setStatus((s) => (s === "published" ? null : "published"))}
          active={status === "published"}
        />
        <MetricCard
          label="Em rascunho"
          value={totals.draft}
          Icon={Pencil}
          tone={totals.draft > 0 ? "warn" : "neutral"}
          sub="não publicado"
          onClick={() => setStatus((s) => (s === "draft" ? null : "draft"))}
          active={status === "draft"}
        />
        <MetricCard
          label="Visualizações"
          value={totals.views}
          Icon={Eye}
          delta={deltaPct(views7, viewsPrev7)}
          sub="últimos 7 dias"
        />
        <MetricCard
          label="Cliques no WhatsApp"
          value={totals.whatsapp}
          Icon={MessageCircle}
          tone="ok"
          sub={`+${whatsapp7} nesta semana`}
        />
        <ConversionCard
          views={totals.views}
          whatsapp={totals.whatsapp}
        />
      </section>

      {/* Grade principal */}
      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <SiteList sites={data.sites} statusFilter={status} now={now} />
          <PerformanceChart series={data.series} range={range} onRange={setRange} />
        </div>

        <div className="space-y-4">
          <TopSites sites={data.sites} />
          <SuggestionsPanel suggestions={suggestions} />
          <HealthPanel sites={data.sites} />
          <ActivityPanel events={data.activity} now={now} />
        </div>
      </div>
    </div>
  );
}

/* ============================ Blocos ============================ */

function Header() {
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[30px]">
          {greeting()} <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-1.5 text-[14px] text-muted">
          Aqui está o desempenho dos seus mini sites.
        </p>
      </div>
      <Link href="/admin/new" className="btn-primary shadow-sm">
        <Plus size={15} /> Criar mini site
      </Link>
    </header>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}
