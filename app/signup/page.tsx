import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignupForm } from "./SignupForm";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function SignupPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  const params = await searchParams;
  const initialError = params.error ? "Não foi possível criar a conta." : null;

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <SignupForm initialError={initialError} />
    </div>
  );
}