"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }
  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }
  if (password !== confirmPassword) {
    return { error: "As senhas não coincidem." };
  }

  // Define para onde o Supabase deve redirecionar depois do email de
  // confirmação (se a confirmação estiver ligada). Em prod, usa a URL
  // canônica do projeto; em dev, usa o host do request.
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "https";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (host ? `${proto}://${host.split(",")[0].trim()}` : "");
  const redirectTo = siteUrl ? `${siteUrl.replace(/\/$/, "")}/auth/callback` : undefined;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      ...(name ? { data: { name } } : {}),
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