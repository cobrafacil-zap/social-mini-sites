"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deleteSite } from "@/lib/actions/sites";

export function ConfirmDeleteForm({ id }: { id: string }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Excluir definitivamente? Esta ação não pode ser desfeita.")) return;
        start(async () => {
          await deleteSite(id);
        });
      }}
      className="btn-danger flex-1"
    >
      {pending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
      {pending ? "Excluindo…" : "Excluir"}
    </button>
  );
}
