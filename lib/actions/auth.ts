"use server";

import { headers, cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** URL pública do projeto (prod usa a canônica; dev usa o host do request). */
async function siteUrl(): Promise<string> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "https";
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (host ? `${proto}://${host.split(",")[0].trim()}` : "")
  );
}

function onlyDigits(v: string): string { return (v || "").replace(/\D/g, ""); }

function isValidCpf(cpf: string): boolean {
  const d = onlyDigits(cpf);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(d[i]!, 10) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(d[9]!, 10)) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(d[i]!, 10) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === parseInt(d[10]!, 10);
}

function formatCpf(digits: string): string {
  const d = onlyDigits(digits).padStart(11, "0").slice(0, 11);
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function mapSignUpError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "Já existe uma conta com esse e-mail. Faça login.";
  }
  if (m.includes("password") && m.includes("at least")) {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }
  if (m.includes("rate limit")) {
    return "Muitas tentativas em sequência. Aguarde alguns minutos.";
  }
  return "Não foi possível criar a conta. Tente novamente.";
}

function mapSignInError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.";
  }
  if (m.includes("invalid login") || m.includes("invalid credentials")) {
    return "E-mail ou senha inválidos.";
  }
  if (m.includes("rate limit")) {
    return "Muitas tentativas em sequência. Aguarde alguns minutos.";
  }
  return "E-mail ou senha inválidos.";
}

export async function signIn(formData: FormData): Promise<{ error?: string } | void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: mapSignInError(error.message) };
  }
  redirect("/admin");
}

export async function signUp(formData: FormData): Promise<{ error?: string } | void> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const cpfRaw = String(formData.get("cpf") ?? "").trim();
  const cpf = onlyDigits(cpfRaw);
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }
  if (!cpf || !isValidCpf(cpf)) {
    return { error: "Informe um CPF válido (11 dígitos)." };
  }
  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }
  if (password !== confirmPassword) {
    return { error: "As senhas não coincidem." };
  }

  // Define para onde o Supabase deve redirecionar depois do email de
  // confirmação (se a confirmação estiver ligada).
  const base = await siteUrl();
  const redirectTo = base ? `${base.replace(/\/$/, "")}/auth/callback` : undefined;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { ...(name ? { name } : {}), cpf, cpfFormatted: formatCpf(cpf) },
      ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
    },
  });
  if (error) {
    return { error: mapSignUpError(error.message) };
  }

  // Sessão criada (confirmação de email desligada): entra no painel.
  if (data.session) {
    redirect("/admin");
  }

  // Conta criada mas sem sessão: confirmação de email ligada. Pede login
  // depois de confirmar.
  redirect("/login?pending=1");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Passo 1 da recuperação: o visitante digita apenas o e-mail.
 *
 * Enviamos o link de recuperação do Supabase, que abre `/forgot-password`
 * já autenticado para ele criar a nova senha. Não existe reset direto por
 * e-mail: sem essa confirmação, qualquer pessoa que soubesse o seu e-mail
 * entraria na sua conta.
 */
export async function requestPasswordReset(
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Informe um e-mail válido." };
  }

  const base = await siteUrl();
  // Mesmo destino já usado na confirmação de cadastro (garante que está na
  // lista de URLs permitidas do Supabase). O modo "recovery" vai num cookie
  // de curta duração, não na query, para o link nunca cair na home.
  const redirectTo = base ? `${base.replace(/\/$/, "")}/auth/callback` : undefined;

  const jar = await cookies();
  jar.set("ms_recovery", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 30,
  });

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    redirectTo ? { redirectTo } : undefined,
  );

  if (error && /rate limit|too many|security purposes/i.test(error.message)) {
    return { error: "Muitos pedidos em sequência. Aguarde alguns minutos e tente de novo." };
  }
  if (error && /sending|smtp|mail/i.test(error.message)) {
    return { error: "Não foi possível enviar o e-mail agora. Tente novamente em instantes." };
  }

  // Mesma resposta com ou sem conta cadastrada — evita descobrir e-mails.
  return { ok: true };
}

/** Passo 2: grava a nova senha. Um campo só, sem confirmação. */
export async function setNewPassword(
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Este link expirou. Peça um novo link de recuperação." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (/rate limit|too many|security purposes/i.test(error.message)) {
      return { error: "Muitas tentativas em sequência. Aguarde alguns minutos." };
    }
    return { error: "Não foi possível salvar a nova senha. Tente novamente." };
  }

  return { ok: true };
}