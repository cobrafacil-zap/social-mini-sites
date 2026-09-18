import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

type Props = { searchParams: Promise<{ error?: string; pending?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  const params = await searchParams;
  const initialMessage = params.pending
    ? "Conta criada! Verifique seu e-mail para confirmar antes de entrar."
    : params.error
    ? "E-mail ou senha inválidos."
    : null;

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <LoginForm initialError={initialMessage} />
    </div>
  );
}