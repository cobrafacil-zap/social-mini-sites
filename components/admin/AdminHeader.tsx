"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, LogOut, ChevronDown, Check, Menu } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

export function AdminHeader({
  email, onOpenNav,
}: { email: string; onOpenNav?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const initials = initialsOf(email);

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-line bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-5">
        <button
          type="button"
          onClick={onOpenNav}
          className="icon-btn lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={17} />
        </button>

        <Link
          href="/admin"
          className="flex min-w-0 items-center gap-2.5 no-underline lg:hidden"
        >
          <Mark />
          <span className="truncate text-[14.5px] font-semibold tracking-[-0.01em] text-ink">Social Mini Sites</span>
        </Link>

        <div className="flex-1" />

        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1.5 text-left transition duration-150 hover:bg-paper-alt"
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-semibold uppercase tracking-wide text-white"
              aria-hidden="true"
            >
              {initials}
            </span>
            <span className="hidden max-w-[180px] truncate text-[13px] font-medium text-ink-soft sm:block">
              {email}
            </span>
            <ChevronDown size={14} className={`text-ink-muted transition duration-150 ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="menu" role="menu">
              <div className="px-2.5 py-2">
                <p className="text-[12px] font-medium uppercase tracking-wide text-muted">Conta</p>
                <p className="mt-0.5 truncate text-[13px] text-ink">{email}</p>
              </div>
              <div className="my-1 h-px bg-line" role="separator" />
              <Link href="/admin" className="menu-item" role="menuitem">
                <LayoutGrid size={15} className="text-ink-muted" />
                Painel
                <Check size={14} className="ml-auto text-primary" aria-hidden="true" />
              </Link>
              <form action={signOut}>
                <button type="submit" className="menu-item" role="menuitem">
                  <LogOut size={15} className="text-ink-muted" />
                  Sair
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[8px] bg-primary text-white shadow-xs"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <LayoutGrid size={size * 0.5} strokeWidth={2.25} />
    </span>
  );
}

function initialsOf(email: string): string {
  const name = email.split("@")[0] ?? "";
  const parts = name.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0]! + parts[1][0]!).toUpperCase();
  return (name.slice(0, 2) || "AD").toUpperCase();
}
