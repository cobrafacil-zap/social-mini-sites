"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CircleAlert } from "lucide-react";
import { signUp } from "@/lib/actions/auth";
import { Field } from "@/components/admin/steps/Field";

export function SignupForm({ initialError }: { initialError: string | null }) {
  const [error, setError] = useState<string | null>(initialError);
  const [submitting, setSubmitting] = useState(false);

  async function action(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const result = await signUp(formData);
    setSubmitting(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">Criar conta</h1>
        <p className="mt-1 text-[13px] text-muted">Acesso administrativo ao painel de clientes.</p>
      </header>

      <form action={action} className="space-y-4">
        <Field label="Nome">
          <input name="name" type="text" autoComplete="name" autoFocus className="input-base" placeholder="Seu nome" />
        </Field>

        <Field label="E-mail">
          <input name="email" type="email" required autoComplete="email" className="input-base" placeholder="voce@empresa.com" />
        </Field>

        <Field label="CPF" hint="Usado depois para recuperar a senha.">
          <input
            name="cpf"
            type="text"
            required
            inputMode="numeric"
            maxLength={14}
            className="input-base tabular-nums"
            placeholder="000.000.000-00"
            onChange={(e) => {
              const d = e.target.value.replace(/\D/g, "").slice(0, 11);
              e.target.value = d
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            }}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Senha" hint="Mínimo 6 caracteres.">
            <input name="password" type="password" required autoComplete="new-password" minLength={6} className="input-base" placeholder="••••••••" />
          </Field>
          <Field label="Confirmar senha">
            <input name="confirmPassword" type="password" required autoComplete="new-password" minLength={6} className="input-base" placeholder="••••••••" />
          </Field>
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-1.5 rounded-[10px] border border-danger/20 bg-danger-50 px-3 py-2 text-[12.5px] leading-relaxed text-danger"
          >
            <CircleAlert size={14} className="mt-px shrink-0" /> {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full shadow-sm">
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {submitting ? "Criando conta…" : "Criar conta"}
        </button>
      </form>

      <p className="mt-5 border-t border-line pt-4 text-center text-[12.5px] text-muted">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-primary no-underline hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
