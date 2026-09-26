"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

type Client = { id: string; name: string; slug: string; status: string };

export function AdminShell({
  email, clients, children,
}: { email: string; clients: Client[]; children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();

  // O editor tem layout próprio (sidebar de etapas + preview): sem chrome duplicado.
  const isEditor = /^\/admin\/edit\//.test(pathname);
  if (isEditor) return <>{children}</>;

  return (
    <div className="min-h-screen bg-paper">
      <AdminHeader email={email} onOpenNav={() => setNavOpen(true)} />
      <div className="flex items-start">
        <AdminSidebar
          clients={clients}
          mobileOpen={navOpen}
          onMobileOpenChange={setNavOpen}
        />
        <main className="min-w-0 flex-1 pb-16 lg:pb-0">{children}</main>
      </div>
    </div>
  );
}
