"use client";

import Link from "next/link";
import { Trophy, Eye, MessageCircle } from "lucide-react";
import { conversion, type DashSite } from "./types";

export function TopSites({ sites, limit = 3 }: { sites: DashSite[]; limit?: number }) {
  const top = [...sites]
    .filter((s) => s.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);

  if (top.length === 0) {
    return (
      <section className="panel p-4 sm:p-5" aria-labelledby="mais-acessados">
        <div className="flex items-center gap-2">
          <Trophy size={15} className="text-primary" />
          <h2 id="mais-acessados" className="section-title">Mais acessados</h2>
        </div>
        <p className="mt-4 rounded-[10px] border border-dashed border-line-strong bg-paper px-4 py-7 text-center text-[12.5px] leading-relaxed text-muted">
          O ranking aparece aqui quando seus sites começarem a receber visitas.
        </p>
      </section>
    );
  }

  return (
    <section className="panel p-4 sm:p-5" aria-labelledby="mais-acessados">
      <div className="flex items-center gap-2">
        <Trophy size={15} className="text-primary" />
        <h2 id="mais-acessados" className="section-title">Mais acessados</h2>
      </div>

      <ol className="mt-3.5 space-y-1.5">
        {top.map((s, i) => {
          const conv = conversion(s.views, s.whatsapp);
          return (
            <li key={s.id}>
              <Link
                href={`/admin/client/${s.id}`}
                className="group flex items-center gap-3 rounded-[10px] border border-line bg-white px-3 py-2.5 no-underline transition duration-150 hover:border-line-strong hover:bg-paper"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-[12px] font-semibold tabular-nums ${
                    i === 0 ? "bg-primary-50 text-primary" : "bg-paper-alt text-ink-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-medium text-ink transition-colors duration-150 group-hover:text-primary">
                    {s.name}
                  </span>
                  <span className="mt-0.5 flex items-center gap-2 text-[11px] tabular-nums text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Eye size={10} /> {s.views}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle size={10} /> {s.whatsapp}
                    </span>
                    <span className="text-line-strong">·</span>
                    {conv}% conv.
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
