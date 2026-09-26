"use client";

import Link from "next/link";
import { Eye, MessageCircle, Instagram, MapPin, Phone, MousePointerClick, Activity } from "lucide-react";
import { eventLabel, groupActivity, relativeTime, type ActivityEvent } from "./types";

const TYPE_ICON: Record<string, typeof Eye> = {
  view: Eye,
  whatsapp: MessageCircle,
  instagram: Instagram,
  comoChegar: MapPin,
  telefone: Phone,
  outro: MousePointerClick,
};

const TYPE_CLS: Record<string, string> = {
  view: "bg-primary-50 text-primary",
  whatsapp: "bg-ok-50 text-ok",
  instagram: "bg-paper-alt text-ink-soft",
  comoChegar: "bg-paper-alt text-ink-soft",
  telefone: "bg-paper-alt text-ink-soft",
  outro: "bg-paper-alt text-ink-soft",
};

export function ActivityPanel({
  events, now, limit = 6,
}: { events: ActivityEvent[]; now: number; limit?: number }) {
  const groups = groupActivity(events);
  // prioriza grupos com repetição, completa com eventos avulsos mais recentes
  const singles = events
    .filter((e) => !groups.some((g) => g.siteId === e.siteId && g.type === e.type))
    .slice(0, limit);
  const items = [...groups, ...singles.map((e) => ({
    key: `${e.siteId}:${e.type}:${e.at}`,
    siteId: e.siteId,
    siteName: e.siteName,
    type: e.type,
    count: 1,
    lastAt: e.at,
  }))]
    .sort((a, b) => b.lastAt - a.lastAt)
    .slice(0, limit);

  return (
    <section className="panel p-4 sm:p-5" aria-labelledby="atividade">
      <div className="flex items-center gap-2">
        <Activity size={15} className="text-primary" />
        <h2 id="atividade" className="section-title">Atividade recente</h2>
      </div>
      <p className="mt-1 text-[12px] text-muted">Eventos agrupados, do mais recente para o mais antigo</p>

      {items.length === 0 ? (
        <p className="mt-4 rounded-[10px] border border-dashed border-line-strong bg-paper px-4 py-8 text-center text-[12.5px] leading-relaxed text-muted">
          Assim que seus sites receberem acessos, você verá aqui a atividade mais recente.
        </p>
      ) : (
        <ul className="mt-3.5 space-y-3">
          {items.map((g) => {
            const Icon = TYPE_ICON[g.type] ?? Activity;
            return (
              <li key={g.key} className="flex gap-2.5">
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] ${
                    TYPE_CLS[g.type] ?? "bg-paper-alt text-ink-soft"
                  }`}
                >
                  <Icon size={13} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] leading-snug text-ink-soft">
                    <Link
                      href={`/admin/client/${g.siteId}`}
                      className="font-medium text-ink no-underline hover:text-primary"
                    >
                      {g.siteName}
                    </Link>{" "}
                    {g.count === 1 ? (
                      <>
                        registrou 1 {eventLabel(g.type)}
                      </>
                    ) : (
                      <>
                        somou{" "}
                        <strong className="font-semibold tabular-nums text-ink">
                          {g.count} {eventLabel(g.type, true)}
                        </strong>
                      </>
                    )}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">{relativeTime(g.lastAt, now)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
