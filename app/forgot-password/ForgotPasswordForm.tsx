"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CircleAlert, CircleCheck } from "lucide-react";
import { resetPasswordWithCpf } from "@/lib/actions/auth";
import { Field } from "@/components/admin/steps/Field";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function action(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const result = await resetPasswordWithCpf(formData);
    setSubmitting(false);
    if (result?.error) setError(result.error);
    else if (result?.ok) setOk(true);
  }

  if (ok) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-ok-50 text-ok">
          <CircleCheck size={20} />
        </span>
        <h1 className="mt-3.5 text-[19px] font-semibold tracking-[-0.015em] text-ink">Senha atualizada</h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
          Sua nova senha foi salva. Use-a para entrar no painel.
        </p>
        <Link href="/login" className="btn-primary mt-5 w-full shadow-sm">
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">Recuperar senha</h1>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          Confirme seu e-mail e o CPF cadastrado para criar uma nova senha.
        </p>
      </header>

      <form action={action} className="space-y-4">
        <Field label="E-mail">
          <input name="email" type="email" required autoComplete="email" autoFocus className="input-base" placeholder="voce@empresa.com" />
        </Field>

        <Field label="CPF">
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
          <Field label="Nova senha">
            <input name="newPassword" type="password" required minLength={6} className="input-base" placeholder="••••••••" />
          </Field>
          <Field label="Confirmar nova senha">
            <input name="confirmPassword" type="password" required minLength={6} className="input-base" placeholder="••••••••" />
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
          {submitting ? "Atualizando…" : "Criar nova senha"}
        </button>
      </form>

      <p className="mt-5 border-t border-line pt-4 text-center text-[12.5px] text-muted">
        Lembrou a senha?{" "}
        <Link href="/login" className="font-medium text-primary no-underline hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
