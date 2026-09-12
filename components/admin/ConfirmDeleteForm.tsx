"use client";

import { useTransition } from "react";
import { deleteSite } from "@/lib/actions/sites";

export function ConfirmDeleteForm({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Excluir definitivamente?")) return;
        start(async () => {
          await deleteSite(id);
        });
      }}
      className="flex-1 bg-danger text-white border-0 rounded-lg py-2 text-[13px] font-semibold cursor-pointer disabled:opacity-60"
    >
      {pending ? "Excluindo…" : "Excluir"}
    </button>
  );
}