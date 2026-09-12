import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-paper">
      <AdminHeader email={user.email ?? ""} />
      {children}
    </div>
  );
}