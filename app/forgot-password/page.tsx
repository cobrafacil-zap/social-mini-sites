import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default async function ForgotPasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
