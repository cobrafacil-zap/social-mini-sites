"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Search, Pencil, ExternalLink, BarChart3, Copy, EyeOff, Rocket,
  Trash2, Store, SlidersHorizontal, X, Layers, type LucideIcon,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OverflowMenu } from "./OverflowMenu";
import { setSiteStatus, duplicateSite } from "@/lib/actions/sites";
import { conversion, relativeTime, type DashSite } from "./types";

type SortKey = "updated" | "views" | "conversion" | "name";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "updated", label: "Atualização" },
  { key: "views", label: "Visualizações" },
  { key: "conversion", label: "Conversão" },
  { key: "name", label: "Nome" },
];

export function SiteList({
  sites, statusFilter, now,
}: {
  sites: DashSite[];
  statusFilter: string | null;
  now: number;
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("updated");
  const [showSort, setShowSort] = useState(false);
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = sites;
    if (statusFilter) list = list.filter((s) => s.status === statusFilter);
    if (term) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.slug.toLowerCase().includes(term) ||
          s.category.toLowerCase().includes(term),
      );
    }
    const sorted = [...list];
    sorted.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "pt-BR");
      if (sort === "views") return b.views - a.views;
      if (sort === "conversion") return conversion(b.views, b.whatsapp) - conversion(a.views, a.whatsapp);
      return b.updatedAt - a.updatedAt;
    });
    return sorted;
  }, [sites, q, sort, statusFilter]);

  function run(fn: () => Promise<{ error?: string } | void>, ok: string) {
    startTransition(async () => {
      const r = await fn();
      setToast(r && "error" in r && r.error ? r.error : ok);
      setTimeout(() => setToast(null), 3200);
    });
  }

  return (
    <section className="panel overflow-hidden" aria-labelledby="seus-sites">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5">
        <div className="min-w-0 flex-1">
          <h2 id="seus-sites" className="section-title">Seus mini sites</h2>
          <p className="mt-0.5 text-[12.5px] text-muted">
            {sites.length === 0
              ? "Você ainda não criou nenhum."
              : `${sites.length} ${sites.length === 1 ? "site" : "sites"}${
                  statusFilter ? ` · filtro: ${statusFilter}` : ""
                }`}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="relative">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar cliente"
              aria-label="Buscar cliente"
              className="w-[168px] rounded-[9px] border border-line bg-paper py-1.5 pl-8 pr-7 text-[12.5px] text-ink transition duration-150 placeholder:text-[#A8AFA9] hover:border-line-strong focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/[0.07]"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Limpar busca"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted transition duration-150 hover:text-ink"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="relative">
            <span className="tip-wrap">
              <button
                type="button"
                onClick={() => setShowSort((v) => !v)}
                aria-expanded={showSort}
                aria-label="Ordenar"
                className="icon-btn border-line"
              >
                <SlidersHorizontal size={15} />
              </button>
              <span className="tip" role="tooltip">Ordenar por {SORTS.find((s) => s.key === sort)?.label.toLowerCase()}</span>
            </span>
            {showSort && (
              <div className="menu min-w-[190px]">
                {SORTS.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    role="menuitemradio"
                    aria-checked={sort === s.key}
                    onClick={() => { setSort(s.key); setShowSort(false); }}
                    className="menu-item"
                  >
                    <span className="min-w-0 flex-1 text-left">{s.label}</span>
                    {sort === s.key && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <p
          role="status"
          className="border-b border-line bg-primary-50 px-5 py-2 text-[12.5px] font-medium text-primary"
        >
          {toast}
        </p>
      )}

      {sites.length === 0 ? (
        <EmptyAll />
      ) : filtered.length === 0 ? (
        <EmptyFilter q={q} onClear={() => setQ("")} hasStatus={!!statusFilter} />
      ) : (
        <ul className="divide-y divide-line">
          {filtered.map((s) => {
            const conv = conversion(s.views, s.whatsapp);
            return (
              <li
                key={s.id}
                className="group relative px-4 py-3 transition-colors duration-150 hover:bg-paper sm:px-5"
              >
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/client/${s.id}`}
                    className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-line bg-paper-alt transition duration-150 group-hover:border-line-strong"
                    aria-label={`Abrir ${s.name}`}
                  >
                    {s.logoUrl || s.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.logoUrl || s.coverUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        style={s.logoUrl ? undefined : { objectPosition: s.coverPosition || "50% 50%" }}
                      />
                    ) : (
                      <Store size={17} className="text-ink-muted" />
                    )}
                  </Link>

                  <Link href={`/admin/client/${s.id}`} className="min-w-0 flex-1 rounded-md no-underline">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[14px] font-semibold tracking-[-0.01em] text-ink transition-colors duration-150 group-hover:text-primary">
                        {s.name}
                      </span>
                      <span className="hidden shrink-0 rounded-md bg-paper-alt px-1.5 py-0.5 text-[11px] text-ink-muted sm:inline">
                        {s.category || s.template}
                      </span>
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12px] text-muted">
                      <span className="truncate">{s.domain}</span>
                      <span className="hidden text-line-strong sm:inline">·</span>
                      <span className="tabular-nums">{relativeTime(s.updatedAt, now)}</span>
                    </span>
                  </Link>

                  <dl className="hidden shrink-0 items-center gap-5 md:flex">
                    <Stat label="Views" value={s.views} />
                    <Stat label="WhatsApp" value={s.whatsapp} />
                    <Stat label="Conv." value={`${conv}%`} />
                  </dl>

                  <div className="hidden shrink-0 sm:block">
                    <StatusBadge status={s.status} />
                  </div>

                  {/* ações principais */}
                  <div className="flex shrink-0 items-center gap-1">
                    <Link href={`/admin/edit/${s.id}`} className="btn-secondary btn-sm">
                      <Pencil size={13} /> Editar
                    </Link>
                    <OverflowMenu
                      label={`Ações de ${s.name}`}
                      items={[
                        { key: "visualizar", label: "Visualizar", href: `/admin/client/${s.id}` },
                        { key: "analytics", label: "Analytics", href: `/admin/stats/${s.id}`, icon: <BarChart3 size={14} /> },
                        {
                          key: "duplicar",
                          label: pending ? "Duplicando…" : "Duplicar",
                          icon: <Copy size={14} />,
                          onSelect: () => run(() => duplicateSite(s.id), `Cópia de ${s.name} criada como rascunho.`),
                        },
                        s.status === "published"
                          ? {
                              key: "abrir",
                              label: "Abrir site",
                              href: s.url,
                              external: true,
                              icon: <ExternalLink size={14} />,
                            }
                          : {
                              key: "publicar",
                              label: "Publicar",
                              icon: <Rocket size={14} />,
                              onSelect: () => run(() => setSiteStatus(s.id, "published"), `${s.name} publicado.`),
                            },
                        s.status === "published"
                          ? {
                              key: "despublicar",
                              label: "Despublicar",
                              icon: <EyeOff size={14} />,
                              onSelect: () => run(() => setSiteStatus(s.id, "draft"), `${s.name} voltou para rascunho.`),
                            }
                          : null,
                        { key: "excluir", label: "Excluir", href: `/admin/delete/${s.id}`, danger: true, icon: <Trash2 size={14} /> },
                      ].filter(Boolean) as Parameters<typeof OverflowMenu>[0]["items"]}
                    />
                  </div>
                </div>

                {/* linha mobile/tablet */}
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 pl-14 md:hidden">
                  <StatusBadge status={s.status} />
                  <span className="text-[12px] tabular-nums text-muted">
                    {s.views} views · {s.whatsapp} WhatsApp · {conv}% conv.
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pending && (
        <p className="sr-only" role="status">
          Processando…
        </p>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="text-right">
      <dt className="text-[10.5px] uppercase tracking-wide text-muted">{label}</dt>
      <dd className="text-[13.5px] font-semibold tabular-nums text-ink">{value}</dd>
    </div>
  );
}

function EmptyAll() {
  return (
    <div className="px-6 py-14 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
        <Layers size={20} />
      </span>
      <p className="mt-3.5 text-[14px] font-medium text-ink">Nenhum mini site ainda</p>
      <p className="mx-auto mt-1 max-w-[320px] text-[12.5px] leading-relaxed text-muted">
        Escolha um modelo visual e cadastre o primeiro cliente. O site fica no ar em menos de um minuto.
      </p>
      <Link href="/admin/new" className="btn-primary mt-4">
        Criar mini site
      </Link>
    </div>
  );
}

function EmptyFilter({ q, onClear, hasStatus }: { q: string; onClear: () => void; hasStatus: boolean }) {
  return (
    <div className="px-6 py-12 text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-paper-alt text-ink-muted">
        <Search size={18} />
      </span>
      <p className="mt-3 text-[13.5px] font-medium text-ink">
        {q ? `Nada encontrado para “${q}”` : "Nenhum site neste filtro"}
      </p>
      <p className="mt-1 text-[12.5px] text-muted">
        {q
          ? "Tente outro nome, categoria ou domínio."
          : hasStatus
            ? "Limpe o filtro de status para ver todos."
            : "Ajuste os filtros para ver mais resultados."}
      </p>
      {(q || hasStatus) && (
        <button type="button" onClick={onClear} className="btn-secondary btn-sm mt-4">
          Limpar filtros
        </button>
      )}
    </div>
  );
}

export type { LucideIcon };