"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, UserCheck, CircleAlert, CircleCheck } from "lucide-react";
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
    const input = document.querySelector<HTMLInputElement>('input[name="email"]');
    if (input) {
      input.value = lastEmail;
      input.focus();
    }
  }

  const neutral = !!error && error.toLowerCase().includes("verifique");

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">Entrar no painel</h1>
        <p className="mt-1 text-[13px] text-muted">Acesse para gerenciar seus clientes e mini sites.</p>
      </header>

      <form action={action} className="space-y-4">
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
          <p
            role="alert"
            className={`flex items-start gap-1.5 rounded-[10px] border px-3 py-2 text-[12.5px] leading-relaxed ${
              neutral ? "border-ok/20 bg-ok-50 text-ok" : "border-danger/20 bg-danger-50 text-danger"
            }`}
          >
            {neutral ? <CircleCheck size={14} className="mt-px shrink-0" /> : <CircleAlert size={14} className="mt-px shrink-0" />}
            {error}
          </p>
        )}

        {lastEmail && (
          <button type="button" onClick={useLastEmail} className="btn-secondary w-full">
            <UserCheck size={15} /> Entrar como {lastEmail}
          </button>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full shadow-sm">
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {submitting ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[12.5px]">
        <Link href="/forgot-password" className="font-medium text-primary no-underline hover:underline">
          Esqueci a senha
        </Link>
        <span className="text-muted">
          Não tem conta?{" "}
          <Link href="/signup" className="font-medium text-primary no-underline hover:underline">
            Criar conta
          </Link>
        </span>
      </div>
    </div>
  );
}
