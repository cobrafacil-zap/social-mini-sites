"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

export function AdminHeader({ email }: { email: string }) {
  return (
    <header className="bg-white border-b border-line">
      <div className="max-w-[1080px] mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5 no-underline">
          <span className="w-[34px] h-[34px] rounded-lg bg-primary flex items-center justify-center">
            <LayoutDashboard size={16} color="#fff" />
          </span>
          <span className="text-[17px] font-semibold text-ink">Social Mini Sites</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[12.5px] text-muted hidden sm:inline">{email}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-[13px] text-muted bg-transparent border-0 cursor-pointer"
            >
              <LogOut size={14} /> Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}