"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
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
      <div className="w-[360px] bg-white border border-line rounded-2xl p-8 text-center">
        <h1 className="text-[18px] font-semibold text-ink">Senha atualizada!</h1>
        <p className="text-[13px] text-muted mt-2">Sua senha foi redefinida com sucesso.</p>
        <Link href="/login" className="inline-block mt-5 bg-primary text-white rounded-[10px] px-5 py-2.5 text-[13px] font-semibold no-underline">
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="w-[360px] bg-white border border-line rounded-2xl p-8">
      <div className="w-[42px] h-[42px] rounded-xl bg-primary flex items-center justify-center mb-[18px]">
        <LayoutDashboard size={20} color="#fff" />
      </div>
      <h1 className="text-[19px] font-semibold text-ink">Recuperar senha</h1>
      <p className="text-[13px] text-muted mt-1 mb-5">Informe e-mail e CPF cadastrados para criar nova senha.</p>

      <Field label="E-mail">
        <input name="email" type="email" required autoComplete="email" className="input-base" placeholder="voce@empresa.com" />
      </Field>

      <Field label="CPF">
        <input
          name="cpf"
          type="text"
          required
          inputMode="numeric"
          maxLength={14}
          className="input-base"
          placeholder="000.000.000-00"
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "").slice(0, 11);
            const f = d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = f;
          }}
        />
      </Field>

      <Field label="Nova senha">
        <input name="newPassword" type="password" required minLength={6} className="input-base" placeholder="••••••••" />
      </Field>

      <Field label="Confirmar nova senha">
        <input name="confirmPassword" type="password" required minLength={6} className="input-base" placeholder="••••••••" />
      </Field>

      {error && <p className="text-[12.5px] text-danger mb-3">{error}</p>}

      <button type="submit" disabled={submitting} className="w-full bg-primary text-white border-none rounded-[10px] py-[11px] text-[14px] font-semibold cursor-pointer disabled:opacity-60">
        {submitting ? "Atualizando..." : "Criar nova senha"}
      </button>

      <p className="text-[12.5px] text-muted mt-4 text-center">
        Lembrou a senha? <Link href="/login" className="text-primary font-medium">Entrar</Link>
      </p>
    </form>
  );
}
