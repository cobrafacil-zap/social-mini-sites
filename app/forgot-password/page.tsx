import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default async function ForgotPasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <ForgotPasswordForm />
    </div>
  );
}
