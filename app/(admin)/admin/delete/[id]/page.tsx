import Link from "next/link";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";
import type { SiteRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

export default async function DeletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("sites").select("*").eq("id", id).single();
  const site = (data ?? null) as SiteRow | null;
  if (!site) notFound();

  const company = (site.company ?? {}) as { name?: string };
  const name = company.name || site.slug;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0D1110]/40 p-4 backdrop-blur-[3px] animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Confirmar exclusão"
    >
      <div className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-pop animate-scaleIn">
        <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-danger-50 text-danger">
          <Trash2 size={18} />
        </span>

        <h2 className="mt-3.5 text-[17px] font-semibold tracking-[-0.015em] text-ink">
          Excluir este cliente?
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
          O mini site de <strong className="font-medium text-ink-soft">{name}</strong> e todas as suas
          estatísticas serão removidos permanentemente. Esta ação não pode ser desfeita.
        </p>

        <div className="mt-5 flex gap-2">
          <Link href={`/admin/client/${site.id}`} className="btn-secondary flex-1">
            Cancelar
          </Link>
          <ConfirmDeleteForm id={id} />
        </div>
      </div>
    </div>
  );
}
