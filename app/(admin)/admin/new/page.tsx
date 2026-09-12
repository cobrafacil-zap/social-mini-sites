import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TemplatePicker } from "@/components/admin/TemplatePicker";

export default function NewSitePage() {
  return (
    <div className="max-w-[1080px] mx-auto px-6 pt-7 pb-16">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-[13.5px] text-neutral-700 no-underline mb-5">
        <ArrowLeft size={15} /> Voltar
      </Link>
      <TemplatePicker />
    </div>
  );
}