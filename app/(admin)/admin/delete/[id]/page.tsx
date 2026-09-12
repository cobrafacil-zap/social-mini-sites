import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";

export const dynamic = "force-dynamic";

export default async function DeletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("sites")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) notFound();

  const company = (data.company ?? {}) as { name?: string };
  const name = company.name || data.slug;

  return (
    <div className="fixed inset-0 bg-[rgba(20,20,18,0.5)] flex items-center justify-center z-[60]">
      <div className="bg-white rounded-2xl p-[26px] w-[360px]">
        <h3 className="text-[15.5px] font-semibold text-ink mb-2">Excluir mini site?</h3>
        <p className="text-[13px] text-muted mb-5">
          Isso removerá permanentemente &ldquo;{name}&rdquo; e todas as suas estatísticas.
        </p>
        <div className="flex gap-2">
          <Link
            href="/admin"
            className="flex-1 flex items-center justify-center text-[13px] text-neutral-700 bg-white border border-line rounded-lg py-2 no-underline"
          >
            Cancelar
          </Link>
          <ConfirmDeleteForm id={id} />
        </div>
      </div>
    </div>
  );
}