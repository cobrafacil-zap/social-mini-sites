"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Plus, Store } from "lucide-react";

type Client = { id: string; name: string; slug: string; status: string };

export function AdminSidebar({ clients }: { clients: Client[] }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

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
            <span className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-muted uppercase">
              <Users size={13} /> Clientes
            </span>
            <Link href="/admin/new" title="Criar mini site" className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center no-underline">
              <Plus size={12} />
            </Link>
          </div>

          <div className="space-y-0.5">
            {clients.length === 0 ? (
              <p className="px-3 py-2 text-[12.5px] text-muted">Nenhum cliente ainda.</p>
            ) : (
              clients.map((c) => {
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
              })
            )}
          </div>
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
