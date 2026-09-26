import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TemplatePicker } from "@/components/admin/TemplatePicker";

export default function NewSitePage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/admin" className="btn-ghost btn-sm -ml-2 mb-4">
        <ArrowLeft size={14} /> Voltar
      </Link>
      <TemplatePicker />
    </div>
  );
}
