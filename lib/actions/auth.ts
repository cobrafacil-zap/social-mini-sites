"use server";

import { headers } from "next/headers";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

export async function resetPasswordWithCpf(formData: FormData): Promise<{ error?: string; ok?: boolean }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const cpf = onlyDigits(String(formData.get("cpf") ?? ""));
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !cpf) return { error: "Informe e-mail e CPF." };
  if (!isValidCpf(cpf)) return { error: "CPF inválido." };
  if (!newPassword || newPassword.length < 6) return { error: "A nova senha precisa ter pelo menos 6 caracteres." };
  if (newPassword !== confirmPassword) return { error: "As senhas não coincidem." };

  const admin = createServiceClient();
  // Busca usuário pelo e-mail (lista paginada)
  let found: { id: string; user_metadata?: Record<string, unknown> } | null = null;
  let page = 1;
  const perPage = 100;
  while (!found) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) return { error: "Falha ao buscar usuário." };
    const match = data.users.find((u) => (u.email ?? "").toLowerCase() === email);
    if (match) { found = { id: match.id, user_metadata: (match.user_metadata ?? {}) as Record<string, unknown> }; break; }
    if (data.users.length < perPage) break;
    page++;
    if (page > 10) break;
  }
  if (!found) return { error: "E-mail não encontrado." };

  const storedCpf = onlyDigits(String((found.user_metadata?.cpf ?? found.user_metadata?.cpfFormatted ?? "") as string));
  // fallback: se usuário antigo sem cpf, nega
  if (!storedCpf) return { error: "Este e-mail não tem CPF cadastrado. Contate o suporte." };
  if (storedCpf !== cpf) return { error: "CPF não confere com o cadastrado para este e-mail." };

  const { error: updErr } = await admin.auth.admin.updateUserById(found.id, { password: newPassword });
  if (updErr) return { error: "Não foi possível atualizar a senha. Tente novamente." };

  return { ok: true };
}