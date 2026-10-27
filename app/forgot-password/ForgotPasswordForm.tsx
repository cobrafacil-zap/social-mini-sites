"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CircleAlert, CircleCheck, MailCheck, KeyRound } from "lucide-react";
import { requestPasswordReset, setNewPassword } from "@/lib/actions/auth";
import { Field } from "@/components/admin/steps/Field";

type Mode = "request" | "reset";

/**
 * Recuperação de senha em dois passos, na mesma tela.
 *
 * 1. `request` — a pessoa digita só o e-mail e recebe o link.
 * 2. `reset`   — volta pelo link já autenticada e define a nova senha
 *                (um campo só, sem confirmação).
 */
export function ForgotPasswordForm({
  mode = "request",
  expired = false,
}: {
  mode?: Mode;
  expired?: boolean;
}) {
  if (mode === "reset") return <NewPasswordStep />;
  return <RequestLinkStep expired={expired} />;
}

function RequestLinkStep({ expired }: { expired: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function action(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const result = await requestPasswordReset(formData);
    setSubmitting(false);
    if (result?.error) setError(result.error);
    else if (result?.ok) setSentTo(String(formData.get("email") ?? "").trim());
  }

  if (sentTo) {
    return (
      <div>
        <div className="text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary">
            <MailCheck size={20} />
          </span>
          <h1 className="mt-3.5 text-[19px] font-semibold tracking-[-0.015em] text-ink">
            Link enviado
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            Se existir uma conta para <span className="font-medium text-ink">{sentTo}</span>,
            o link chega em instantes. Confira também a caixa de spam.
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
            O link abre esta página já liberada para você criar a nova senha.
          </p>
        </div>

        <div className="mt-5 space-y-2.5">
          <Link href="/login" className="btn-primary w-full shadow-sm">
            Voltar ao login
          </Link>
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="btn-secondary w-full"
          >
            Enviar para outro e-mail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">Recuperar senha</h1>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          Digite seu e-mail. Você recebe um link para criar uma nova senha — sem CPF
          e sem precisar confirmar nada além de abrir o link.
        </p>
      </header>

      {expired && (
        <p
          role="alert"
          className="mb-4 flex items-start gap-1.5 rounded-[10px] border border-warn/20 bg-warn-50 px-3 py-2 text-[12.5px] leading-relaxed text-warn"
        >
          <CircleAlert size={14} className="mt-px shrink-0" />
          Esse link expirou ou foi aberto em outro navegador. Peça um novo abaixo.
        </p>
      )}

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
          {submitting ? "Enviando…" : "Enviar link de recuperação"}
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

function NewPasswordStep() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function action(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const result = await setNewPassword(formData);
    setSubmitting(false);
    if (result?.error) setError(result.error);
    else if (result?.ok) setDone(true);
  }

  if (done) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-ok-50 text-ok">
          <CircleCheck size={20} />
        </span>
        <h1 className="mt-3.5 text-[19px] font-semibold tracking-[-0.015em] text-ink">
          Senha atualizada
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
          Sua nova senha já está valendo. Você também está conectado neste navegador.
        </p>
        <Link href="/admin" className="btn-primary mt-5 w-full shadow-sm">
          Ir para o painel
        </Link>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary-50 text-primary">
          <KeyRound size={18} />
        </div>
        <h1 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">Criar nova senha</h1>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          Você entrou pelo link de recuperação. Escolha a nova senha — só ela,
          sem confirmação.
        </p>
      </header>

      <form action={action} className="space-y-4">
        <Field label="Nova senha" hint="Mínimo de 6 caracteres.">
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            autoFocus
            className="input-base"
            placeholder="••••••••"
          />
        </Field>

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
          {submitting ? "Salvando…" : "Salvar nova senha"}
        </button>
      </form>

      <p className="mt-5 border-t border-line pt-4 text-center text-[12.5px] text-muted">
        <Link href="/login" className="font-medium text-primary no-underline hover:underline">
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
