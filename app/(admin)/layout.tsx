import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sites } = await supabase
    .from("sites")
    .select("id, slug, status, company")
    .order("updated_at", { ascending: false });

  const clients = (sites ?? []).map((s: unknown) => {
    const r = s as { id: string; slug: string; status: string; company: unknown };
    const company = (r.company ?? {}) as { name?: string };
    return { id: r.id, slug: r.slug, status: r.status, name: company.name || "(sem nome)" };
  });

  return (
    <AdminShell email={user.email ?? ""} clients={clients}>
      {children}
    </AdminShell>
  );
}
