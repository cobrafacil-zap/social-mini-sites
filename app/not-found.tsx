import Link from "next/link";
import { Layers, ArrowLeft } from "lucide-react";
import { Mark } from "@/components/admin/AdminHeader";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-paper px-4 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
        <Layers size={22} />
      </span>
      <div>
        <p className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Página não encontrada</p>
        <p className="mx-auto mt-1.5 max-w-[38ch] text-[13.5px] leading-relaxed text-muted">
          Este mini site não está disponível. Ele pode ter sido removido, desativado ou o endereço está errado.
        </p>
      </div>
      <Link href="/admin" className="btn-secondary">
        <ArrowLeft size={14} /> Voltar ao painel
      </Link>
      <div className="absolute left-6 top-6 opacity-60">
        <Mark size={26} />
      </div>
    </div>
  );
}
