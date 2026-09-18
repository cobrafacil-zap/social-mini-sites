"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
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
    <form action={action} className="w-[340px] bg-white border border-line rounded-2xl p-8">
      <div className="w-[42px] h-[42px] rounded-xl bg-primary flex items-center justify-center mb-[18px]">
        <LayoutDashboard size={20} color="#fff" />
      </div>
      <h1 className="text-[19px] font-semibold text-ink">Criar conta</h1>
      <p className="text-[13px] text-muted mt-1 mb-5">Acesso ao painel administrativo</p>

      <Field label="Nome">
        <input
          name="name"
          type="text"
          autoComplete="name"
          autoFocus
          className="input-base"
          placeholder="Seu nome"
        />
      </Field>

      <Field label="E-mail">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="input-base"
          placeholder="voce@empresa.com"
        />
      </Field>

      <Field label="Senha" hint="Mínimo de 6 caracteres.">
        <input
          name="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={6}
          className="input-base"
          placeholder="••••••••"
        />
      </Field>

      <Field label="Confirmar senha">
        <input
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          minLength={6}
          className="input-base"
          placeholder="••••••••"
        />
      </Field>

      {error && (
        <p className="text-[12.5px] text-danger mb-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white border-none rounded-[10px] py-[11px] text-[14px] font-semibold cursor-pointer disabled:opacity-60"
      >
        {submitting ? "Criando conta…" : "Criar conta"}
      </button>

      <p className="text-[12.5px] text-muted mt-4 text-center">
        Já tem conta?{" "}
        <Link href="/login" className="text-primary font-medium">
          Entrar
        </Link>
      </p>
    </form>
  );
}