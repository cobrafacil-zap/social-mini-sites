import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { AuthShell } from "@/components/auth/AuthShell";

type Props = { searchParams: Promise<{ reset?: string; expired?: string }> };

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  const recovery = params.reset === "1";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Já logado e sem pedido de recuperação: vai direto para o painel.
  if (user && !recovery) redirect("/admin");

  return (
    <AuthShell>
      <ForgotPasswordForm
        mode={user && recovery ? "reset" : "request"}
        expired={params.expired === "1" || (recovery && !user)}
      />
    </AuthShell>
  );
}
