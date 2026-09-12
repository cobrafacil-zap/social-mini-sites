import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, Plus, Eye, Pencil, Trash2, BarChart3, ExternalLink, MessageCircle, CheckCircle2 } from "lucide-react";
import type { SiteRow, EventRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ data: sites }, { data: events }] = await Promise.all([
    supabase
      .from("sites")
      .select("*")
      .order("updated_at", { ascending: false }),
    supabase.from("events").select("site_id, event_type"),
  ]);

  const list = (sites ?? []) as SiteRow[];
  const eventList = (events ?? []) as Pick<EventRow, "site_id" | "event_type">[];

  const totals = list.reduce(
    (acc, s) => {
      acc.total++;
      if (s.status === "published") acc.published++;
      if (s.status === "draft") acc.draft++;
      return acc;
    },
    { total: 0, published: 0, draft: 0 },
  );

  const viewsBySite: Record<string, number> = {};
  const whatsappBySite: Record<string, number> = {};
  eventList.forEach((e) => {
    if (e.event_type === "view") viewsBySite[e.site_id] = (viewsBySite[e.site_id] ?? 0) + 1;
    if (e.event_type === "whatsapp") whatsappBySite[e.site_id] = (whatsappBySite[e.site_id] ?? 0) + 1;
  });

  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "smdigital.com").toLowerCase();

  return (
    <div className="max-w-[1080px] mx-auto px-6 pt-7 pb-16">
      <div className="flex justify-between items-center mb-7">
        <h2 className="text-[15px] font-semibold text-ink">Clientes</h2>
        <Link
          href="/admin/new"
          className="flex items-center gap-1.5 bg-primary text-white border-0 rounded-lg px-4 py-2 text-[13.5px] font-semibold no-underline"
        >
          <Plus size={15} /> Criar mini site
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-7">
        <KpiCard label="Total de mini sites" value={totals.total} Icon={LayoutDashboard} />
        <KpiCard label="Publicados" value={totals.published} Icon={CheckCircle2} />
        <KpiCard label="Em rascunho" value={totals.draft} Icon={Pencil} />
        <KpiCard
          label="Visualizações"
          value={Object.values(viewsBySite).reduce((a, b) => a + b, 0)}
          Icon={Eye}
        />
        <KpiCard
          label="Cliques no WhatsApp"
          value={Object.values(whatsappBySite).reduce((a, b) => a + b, 0)}
          Icon={MessageCircle}
        />
      </div>

      <div className="bg-white border border-line rounded-xl overflow-hidden">
        {list.length === 0 ? (
          <div className="p-10 text-center text-[#8B8B85] text-[13.5px]">
            Nenhum mini site ainda. Crie o primeiro clicando em &quot;Criar mini site&quot;.
          </div>
        ) : (
          list.map((s, i) => {
            const company = (s.company ?? {}) as { name?: string };
            const name = company.name || "(sem nome)";
            const isLast = i === list.length - 1;
            return (
              <div
                key={s.id}
                className={`flex items-center px-[18px] py-3.5 gap-3.5 ${
                  isLast ? "" : "border-b border-[#EFEEE9]"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-ink truncate">{name}</p>
                  <p className="text-[12.5px] text-[#8B8B85]">
                    {s.slug}.{root}
                  </p>
                </div>
                <StatusBadge status={s.status} />
                <div className="text-[12.5px] text-muted w-[90px] text-right">
                  {viewsBySite[s.id] ?? 0} views
                </div>
                <div className="flex gap-1.5">
                  <IconLink href={`/admin/edit/${s.id}`} title="Editar"><Pencil size={14} /></IconLink>
                  <IconLink href={`/admin/stats/${s.id}`} title="Estatísticas"><BarChart3 size={14} /></IconLink>
                  {s.status === "published" && (
                    <a
                      href={`https://${s.slug}.${root}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ver mini site"
                      className="icon-btn"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <IconLink href={`/admin/delete/${s.id}`} title="Excluir" danger>
                    <Trash2 size={14} />
                  </IconLink>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`.icon-btn{width:30px;height:30px;border-radius:8px;border:1px solid #E7E6E1;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#3A3D38;text-decoration:none}`}</style>
    </div>
  );
}

function KpiCard({ label, value, Icon }: { label: string; value: number; Icon: React.ComponentType<{ size?: number; color?: string }> }) {
  return (
    <div className="bg-white border border-line rounded-xl p-4 flex items-start justify-between">
      <div>
        <p className="text-[13px] text-muted">{label}</p>
        <p className="text-2xl font-semibold text-ink mt-1">{value}</p>
      </div>
      <div className="w-9 h-9 rounded-lg bg-[#F1F5F2] flex items-center justify-center text-primary">
        <Icon size={17} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    draft: { label: "Rascunho", bg: "#FBF3DF", fg: "#93650F" },
    published: { label: "Publicado", bg: "#E4F3EC", fg: "#0E6B4F" },
    disabled: { label: "Desativado", bg: "#F1E7E6", fg: "#9C3B31" },
  };
  const s = map[status] ?? map.draft;
  return (
    <span className="px-2.5 py-1 rounded-md text-xs font-medium inline-block" style={{ background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}

function IconLink({
  href, title, danger, children,
}: { href: string; title: string; danger?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      title={title}
      className="icon-btn"
      style={danger ? { color: "#9C3B31" } : undefined}
    >
      {children}
    </Link>
  );
}