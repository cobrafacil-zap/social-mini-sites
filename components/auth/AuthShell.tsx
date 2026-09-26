"use client";

import { Mark } from "@/components/admin/AdminHeader";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-4 py-10">
      {/* fundo decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 50% -8%, rgb(20 92 75 / 0.10), transparent 62%), radial-gradient(45% 40% at 92% 8%, rgb(217 164 65 / 0.10), transparent 60%)",
        }}
      />
      <div className="relative w-full max-w-[380px]">
        <div className="mb-6 flex flex-col items-center gap-2.5">
          <Mark size={34} />
          <div className="text-center">
            <p className="text-[15px] font-semibold tracking-[-0.01em] text-ink">Social Mini Sites</p>
            <p className="text-[12.5px] text-muted">Plataforma de mini sites para clientes</p>
          </div>
        </div>
        <div className="animate-rise rounded-2xl border border-line bg-white p-6 shadow-card sm:p-7">
          {children}
        </div>
      </div>
    </div>
  );
}
