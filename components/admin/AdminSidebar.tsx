"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid, Users, Plus, Search, ChevronDown, X, Store,
  BarChart3, Contact, Settings,
} from "lucide-react";
import { Mark } from "./AdminHeader";

type Client = { id: string; name: string; slug: string; status: string };

function SoonItem({
  icon: Icon, label, hint,
}: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; hint: string }) {
  return (
    <span className="tip-wrap flex">
      <span
        aria-disabled="true"
        className="flex cursor-not-allowed items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] text-ink-muted opacity-55"
      >
        <Icon size={15} className="shrink-0" />
        {label}
        <span className="ml-auto rounded-md bg-paper-alt px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-muted">
          Breve
        </span>
      </span>
      <span className="tip" role="tooltip">{hint}</span>
    </span>
  );
}

export function AdminSidebar({
  clients, mobileOpen, onMobileOpenChange,
}: { clients: Client[]; mobileOpen: boolean; onMobileOpenChange: (v: boolean) => void }) {
  const pathname = usePathname();
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(true);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter(
      (c) => c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term),
    );
  }, [clients, q]);

  const visible = expanded ? filtered : filtered.slice(0, 6);

  const closeMobile = useCallback(() => onMobileOpenChange(false), [onMobileOpenChange]);

  // fecha o drawer no mobile ao navegar
  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isCurrent = (id: string) => pathname.includes(id);
  const isDashboard = pathname === "/admin" || pathname === "/admin/";

  const body = (
    <nav className="flex h-full flex-col" aria-label="Navegação principal">
      {/* Marca */}
      <Link
        href="/admin"
        onClick={closeMobile}
        className="flex items-center gap-2.5 px-4 no-underline"
      >
        <Mark />
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-semibold leading-tight tracking-[-0.01em] text-ink">
            Social Mini Sites
          </span>
          <span className="block truncate text-[11px] leading-tight text-muted">Painel de clientes</span>
        </span>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); closeMobile(); }}
          className="icon-btn ml-auto lg:hidden"
          aria-label="Fechar menu"
        >
          <X size={16} />
        </button>
      </Link>

      <div className="mt-5 px-2.5">
        <Link
          href="/admin"
          onClick={closeMobile}
          aria-current={isDashboard ? "page" : undefined}
          className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] font-medium no-underline transition duration-150 ${
            isDashboard ? "bg-primary-50 text-primary" : "text-ink-soft hover:bg-paper-alt hover:text-ink"
          }`}
        >
          <LayoutGrid size={16} className="shrink-0 opacity-80" />
          Visão geral
        </Link>
      </div>

      {/* Clientes */}
      <div className="mt-6 flex min-h-0 flex-1 flex-col px-2.5">
        <p className="px-1.5 pb-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
          Clientes
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex flex-1 items-center gap-1.5 rounded-md px-1.5 py-1 text-[12.5px] font-medium text-ink-soft transition duration-150 hover:text-ink"
          >
            <Users size={12} className="shrink-0 text-muted" />
            Todos os clientes
            <span className="rounded-full bg-paper-alt px-1.5 py-px text-[10px] font-semibold tabular-nums text-ink-muted">
              {clients.length}
            </span>
            <ChevronDown
              size={12}
              className={`ml-auto text-muted transition duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
          <span className="tip-wrap">
            <Link href="/admin/new" onClick={closeMobile} className="icon-btn h-6 w-6" aria-label="Novo cliente">
              <Plus size={13} />
            </Link>
            <span className="tip" role="tooltip">Novo cliente</span>
          </span>
        </div>

        {open && (
          <div className="animate-rise">
            <div className="relative mt-2">
              <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setExpanded(true); }}
                placeholder="Buscar cliente"
                aria-label="Buscar cliente"
                className="w-full rounded-[9px] border border-line bg-paper py-1.5 pl-8 pr-2 text-[12.5px] text-ink transition duration-150 placeholder:text-[#A8AFA9] hover:border-line-strong focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/[0.07]"
              />
            </div>

            <div className="no-scrollbar mt-1.5 max-h-[min(52vh,520px)] space-y-0.5 overflow-y-auto pr-0.5">
              {filtered.length === 0 ? (
                <p className="px-2.5 py-3 text-[12.5px] text-muted">
                  {q ? "Nenhum resultado." : "Nenhum cliente ainda."}
                </p>
              ) : (
                <>
                  {visible.map((c) => (
                    <Link
                      key={c.id}
                      href={`/admin/client/${c.id}`}
                      onClick={closeMobile}
                      title={c.name}
                      aria-current={isCurrent(c.id) ? "page" : undefined}
                      className={`group flex items-center gap-2.5 rounded-[9px] px-2.5 py-[7px] text-[13px] no-underline transition duration-150 ${
                        isCurrent(c.id)
                          ? "bg-primary-50 font-medium text-primary"
                          : "text-ink-soft hover:bg-paper-alt hover:text-ink"
                      }`}
                    >
                      <Store size={14} className="shrink-0 opacity-50" />
                      <span className="min-w-0 flex-1 truncate">{c.name || "(sem nome)"}</span>
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full transition duration-150 ${
                          c.status === "published"
                            ? "bg-okDot"
                            : c.status === "draft"
                              ? "bg-[#F79009]"
                              : "bg-[#C8CFCC]"
                        }`}
                        aria-label={c.status}
                      />
                    </Link>
                  ))}

                  {filtered.length > 6 && (
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => !v)}
                      className="flex w-full items-center justify-center gap-1 rounded-[9px] px-2.5 py-1.5 text-[12px] font-medium text-primary transition duration-150 hover:bg-primary-50"
                    >
                      <ChevronDown size={13} className={`transition duration-200 ${expanded ? "rotate-180" : ""}`} />
                      {expanded ? "Mostrar menos" : `Ver todos (${filtered.length})`}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gerenciamento — estrutura pronta; itens sem destino ficam desabilitados */}
      <div className="mt-6 px-2.5">
        <p className="px-1.5 pb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
          Gerenciamento
        </p>
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/admin"
              onClick={closeMobile}
              className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] no-underline transition duration-150 ${
                isDashboard
                  ? "bg-primary-50 font-medium text-primary"
                  : "text-ink-soft hover:bg-paper-alt hover:text-ink"
              }`}
            >
              <BarChart3 size={15} className="shrink-0 opacity-70" />
              Analytics
            </Link>
          </li>
          <li>
            <SoonItem icon={Contact} label="Leads" hint="Baseado nos cliques de contato" />
          </li>
          <li>
            <SoonItem icon={Settings} label="Configurações" hint="Em breve" />
          </li>
        </ul>
      </div>

      {/* Novo cliente */}
      <div className="p-2.5">
        <Link
          href="/admin/new"
          onClick={closeMobile}
          className="flex items-center justify-center gap-1.5 rounded-[10px] bg-primary px-3 py-2.5 text-[13px] font-semibold text-white no-underline shadow-xs transition duration-150 hover:bg-primary-700 hover:shadow-sm active:scale-[0.98]"
        >
          <Plus size={15} /> Novo cliente
        </Link>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[var(--sidebar-w)] shrink-0 overflow-y-auto border-r border-line bg-white lg:block">
        <div className="py-4">{body}</div>
      </aside>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={closeMobile}
            className="absolute inset-0 bg-[#0D1110]/25 backdrop-blur-[2px] animate-fadeIn"
          />
          <div className="absolute inset-y-0 left-0 w-[270px] overflow-y-auto border-r border-line bg-white shadow-pop animate-slideInLeft">
            <div className="py-4">{body}</div>
          </div>
        </div>
      )}
    </>
  );
}
