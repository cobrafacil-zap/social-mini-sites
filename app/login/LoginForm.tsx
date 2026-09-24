"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, User } from "lucide-react";
import { signIn } from "@/lib/actions/auth";
import { Field } from "@/components/admin/steps/Field";

export function LoginForm({ initialError }: { initialError: string | null }) {
  const [error, setError] = useState<string | null>(initialError);
  const [submitting, setSubmitting] = useState(false);
  const [lastEmail, setLastEmail] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lastEmail");
    if (saved) setLastEmail(saved);
  }, []);

  async function action(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    if (email) localStorage.setItem("lastEmail", email);
    setSubmitting(true);
    setError(null);
    const result = await signIn(formData);
    setSubmitting(false);
    if (result?.error) setError(result.error);
  }

  function useLastEmail() {
    if (!lastEmail) return;
    const input = document.querySelector('input[name="email"]') as HTMLInputElement | null;
    if (input) { input.value = lastEmail; input.focus(); }
  }

  // Mensagens neutras (ex.: "verifique seu email") ganham cor ok; erros ficam em vermelho.
  const isNeutral = !!error && error.toLowerCase().includes("verifique");
  const messageClass = isNeutral
    ? "text-[12.5px] text-ok mb-3"
    : "text-[12.5px] text-danger mb-3";

  return (
    <form action={action} className="w-[340px] bg-white border border-line rounded-2xl p-8">
      <div className="w-[42px] h-[42px] rounded-xl bg-primary flex items-center justify-center mb-[18px]">
        <LayoutDashboard size={20} color="#fff" />
      </div>
      <h1 className="text-[19px] font-semibold text-ink">Social Mini Sites</h1>
      <p className="text-[13px] text-muted mt-1 mb-5">Painel administrativo</p>

      <Field label="E-mail">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          className="input-base"
          placeholder="voce@empresa.com"
        />
      </Field>

      <Field label="Senha">
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="input-base"
          placeholder="••••••••"
        />
      </Field>

      {error && (
        <p className={messageClass}>{error}</p>
      )}

      {lastEmail && (
        <button
          type="button"
          onClick={useLastEmail}
          className="w-full mb-2 flex items-center justify-center gap-1.5 bg-white border border-line rounded-[10px] py-2.5 text-[13px] font-medium text-ink cursor-pointer"
        >
          <User size={14} /> Entrar como {lastEmail}
        </button>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white border-none rounded-[10px] py-[11px] text-[14px] font-semibold cursor-pointer disabled:opacity-60"
      >
        {submitting ? "Entrando…" : "Entrar"}
      </button>

      <div className="flex justify-between mt-3">
        <Link href="/forgot-password" className="text-[12.5px] text-primary font-medium">
          Esqueci a senha
        </Link>
        <Link href="/signup" className="text-[12.5px] text-primary font-medium">
          Criar conta
        </Link>
      </div>
    </form>
  );
}