"use client";

import { useState } from "react";
import { LayoutDashboard, Lock } from "lucide-react";
import { signIn } from "@/lib/actions/auth";

export function LoginForm({ initialError }: { initialError: string | null }) {
  const [error, setError] = useState<string | null>(initialError);
  const [submitting, setSubmitting] = useState(false);

  async function action(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const result = await signIn(formData);
    setSubmitting(false);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={action} className="w-[340px] bg-white border border-line rounded-2xl p-8">
      <div className="w-[42px] h-[42px] rounded-xl bg-primary flex items-center justify-center mb-[18px]">
        <LayoutDashboard size={20} color="#fff" />
      </div>
      <h1 className="text-[19px] font-semibold text-ink">Social Mini Sites</h1>
      <p className="text-[13px] text-muted mt-1 mb-5">Painel administrativo</p>

      <label className="block mb-4">
        <span className="block text-[13px] font-medium text-neutral-700 mb-1.5">E-mail</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          className="input-base"
          placeholder="voce@empresa.com"
        />
      </label>

      <label className="block mb-4">
        <span className="block text-[13px] font-medium text-neutral-700 mb-1.5">Senha</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="input-base"
          placeholder="••••••••"
        />
      </label>

      {error && (
        <p className="text-[12.5px] text-danger mb-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white border-none rounded-[10px] py-[11px] text-[14px] font-semibold cursor-pointer disabled:opacity-60"
      >
        {submitting ? "Entrando…" : "Entrar"}
      </button>

      <p className="text-[11.5px] text-neutral-400 mt-4 flex items-center gap-1.5">
        <Lock size={11} /> Acesso restrito
      </p>
    </form>
  );
}