"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Plus, Store, Search, ChevronDown } from "lucide-react";

type Client = { id: string; name: string; slug: string; status: string };

export function AdminSidebar({ clients }: { clients: Client[] }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(true);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term));
  }, [clients, q]);

  const visible = expanded ? filtered : filtered.slice(0, 5);

  return (
    <aside className="w-[260px] shrink-0 bg-white border-r border-line min-h-[calc(100vh-57px)] sticky top-[57px] hidden lg:block overflow-y-auto">
      <nav className="py-5 px-3">
        <Link
          href="/admin"
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium no-underline mb-1 ${isActive("/admin") && pathname === "/admin" ? "bg-[#EAF1EE] text-primary" : "text-ink hover:bg-[#FAFAF7]"}`}
        >
          <LayoutDashboard size={16} /> Dashboard
        </Link>

        <div className="mt-5">
          <div className="flex items-center justify-between px-3 mb-2">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1.5 text-[12px] font-semibold tracking-wide text-muted uppercase hover:text-ink"
            >
              <Users size={13} /> Clientes
              <ChevronDown size={12} className={`transition ${open ? "rotate-180" : ""}`} />
            </button>
            <Link href="/admin/new" title="Criar mini site" className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center no-underline">
              <Plus size={12} />
            </Link>
          </div>

          {open && (
            <>
              {/* busca com lupa */}
              <div className="px-3 mb-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    value={q}
                    onChange={(e) => { setQ(e.target.value); setExpanded(true); }}
                    placeholder="Buscar cliente..."
                    className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-line bg-[#FAFAF7] text-[12.5px] placeholder:text-muted focus:outline-none focus:border-primary/40"
                  />
                </div>
              </div>

              <div className="space-y-0.5">
                {filtered.length === 0 ? (
                  <p className="px-3 py-2 text-[12.5px] text-muted">{q ? "Nenhum resultado." : "Nenhum cliente ainda."}</p>
                ) : (
                  <>
                    {visible.map((c) => {
                      const active = pathname.includes(c.id) || pathname.includes(c.slug);
                      return (
                        <Link
                          key={c.id}
                          href={`/admin/client/${c.id}`}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] no-underline truncate ${active ? "bg-[#EAF1EE] text-primary font-medium" : "text-[#3A3D38] hover:bg-[#FAFAF7]"}`}
                          title={c.name}
                        >
                          <Store size={14} className="shrink-0 opacity-60" />
                          <span className="truncate flex-1">{c.name || "(sem nome)"}</span>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${c.status === "published" ? "bg-ok" : c.status === "draft" ? "bg-[#D9A441]" : "bg-danger"}`} />
                        </Link>
                      );
                    })}
                    {/* setinha para baixo/cima independente da quantidade */}
                    <button
                      type="button"
                      onClick={() => setExpanded(!expanded)}
                      className="w-full flex items-center justify-center gap-1 px-3 py-2 text-[12.5px] font-medium text-primary hover:bg-[#EAF1EE] rounded-lg"
                    >
                      <ChevronDown size={14} className={`transition ${expanded ? "rotate-180" : ""}`} />
                      {expanded ? "Esconder" : filtered.length > 5 ? `Ver todos (${filtered.length})` : "Ver todos"}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 px-3">
          <Link
            href="/admin/new"
            className="flex items-center justify-center gap-1.5 bg-primary text-white rounded-lg px-3 py-2.5 text-[13px] font-semibold no-underline"
          >
            <Plus size={14} /> Novo cliente
          </Link>
        </div>
      </nav>
    </aside>
  );
}
