"use client";

import { useState } from "react";
import { createSite } from "@/lib/actions/sites";
import { UtensilsCrossed, ShoppingBag, Briefcase, User, Sparkles } from "lucide-react";

type Model = {
  id: string;
  label: string;
  desc: string;
  template: "restaurante" | "loja" | "servicos" | "profissional";
  Icon: typeof UtensilsCrossed;
  palette: { primary: string; secondary: string; bg: string; text: string; buttonStyle: "rounded" | "pill" | "square" };
};

const MODELS: Model[] = [
  {
    id: "villa-classico",
    label: "Restaurante Clássico",
    desc: "Villa Itália — ideal para pizzaria e restaurante",
    template: "restaurante",
    Icon: UtensilsCrossed,
    palette: { primary: "#9B1B30", secondary: "#E9C46A", bg: "#FFF8F0", text: "#1A1A1A", buttonStyle: "rounded" },
  },
  {
    id: "burger-moderno",
    label: "Restaurante Moderno",
    desc: "Preto + vermelho — hamburgueria e bar",
    template: "restaurante",
    Icon: UtensilsCrossed,
    palette: { primary: "#111111", secondary: "#E30613", bg: "#FFFFFF", text: "#111111", buttonStyle: "pill" },
  },
  {
    id: "boutique-elegante",
    label: "Loja Elegante",
    desc: "Boutique — roxo sofisticado",
    template: "loja",
    Icon: ShoppingBag,
    palette: { primary: "#3B2A4A", secondary: "#D4A5C4", bg: "#FAF6F2", text: "#1A1410", buttonStyle: "pill" },
  },
  {
    id: "loja-urbana",
    label: "Loja Urbana",
    desc: "Streetwear — preto e neon",
    template: "loja",
    Icon: ShoppingBag,
    palette: { primary: "#0A0A0A", secondary: "#00E676", bg: "#FFFFFF", text: "#0A0A0A", buttonStyle: "square" },
  },
  {
    id: "servico-tecnico",
    label: "Serviços Técnico",
    desc: "Azul + amarelo — eletricista, oficina",
    template: "servicos",
    Icon: Briefcase,
    palette: { primary: "#0B3D91", secondary: "#FFB400", bg: "#FFFFFF", text: "#0A0A0A", buttonStyle: "square" },
  },
  {
    id: "servico-premium",
    label: "Serviços Premium",
    desc: "Preto + dourado — clínica, estética",
    template: "servicos",
    Icon: Briefcase,
    palette: { primary: "#0A0A0A", secondary: "#D9A441", bg: "#FFFBF5", text: "#1E1B2E", buttonStyle: "rounded" },
  },
  {
    id: "saude-bemestar",
    label: "Saúde & Bem-estar",
    desc: "Verde sálvia — psicóloga, nutri",
    template: "profissional",
    Icon: User,
    palette: { primary: "#5B6F4A", secondary: "#E8B4A0", bg: "#F8F5F0", text: "#1A1A1A", buttonStyle: "rounded" },
  },
  {
    id: "corporativo",
    label: "Corporativo",
    desc: "Azul marinho — advocacia, contabilidade",
    template: "profissional",
    Icon: User,
    palette: { primary: "#0F2A44", secondary: "#C5A254", bg: "#F8F6F1", text: "#0F172A", buttonStyle: "rounded" },
  },
];

export function TemplatePicker() {
  const [useSeed, setUseSeed] = useState(true);

  return (
    <div>
      <h1 className="text-[18px] font-bold uppercase tracking-wide text-ink mb-1">Escolha um modelo</h1>
      <p className="text-[13px] text-muted mb-4">
        São 8 modelos prontos — escolha o visual que mais combina com o cliente. Depois você preenche as informações.
      </p>

      <label className="flex items-center gap-2 mb-5 text-[13px] text-ink cursor-pointer select-none bg-[#FAFAF7] border border-line rounded-lg px-3 py-2.5">
        <input type="checkbox" checked={useSeed} onChange={(e) => setUseSeed(e.target.checked)} className="w-4 h-4 cursor-pointer accent-primary" />
        <Sparkles size={14} className="text-primary" />
        <span>
          Preencher com <strong>exemplo completo</strong> (capa, galeria e botões)
        </span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MODELS.map((m) => (
          <form key={m.id} action={createSite}>
            <input type="hidden" name="template" value={m.template} />
            <input type="hidden" name="modelId" value={m.id} />
            {useSeed && <input type="hidden" name="useSeed" value="on" />}
            <button
              type="submit"
              className="w-full border border-line rounded-xl overflow-hidden bg-white hover:border-primary hover:shadow-md transition text-left group"
            >
              {/* preview mini */}
              <div className="h-[110px] relative overflow-hidden" style={{ background: m.palette.bg }}>
                <div className="absolute inset-x-0 top-0 h-[42px]" style={{ background: m.palette.primary }} />
                <div className="absolute left-3 top-[28px] w-9 h-9 rounded-lg bg-white border-2 border-white shadow flex items-center justify-center" style={{ borderColor: m.palette.bg }}>
                  <m.Icon size={14} color={m.palette.primary} />
                </div>
                <div className="absolute left-3 right-3 bottom-2 flex gap-1">
                  <span className="flex-1 h-2 rounded-full" style={{ background: m.palette.primary, opacity: 0.15 }} />
                  <span className="flex-1 h-2 rounded-full" style={{ background: m.palette.secondary }} />
                </div>
                <div className="absolute right-2 top-2 flex gap-1">
                  <span className="w-3 h-3 rounded-full border border-white/30" style={{ background: m.palette.primary }} />
                  <span className="w-3 h-3 rounded-full border border-white/30" style={{ background: m.palette.secondary }} />
                  <span className="w-3 h-3 rounded-full border border-white/30" style={{ background: m.palette.text }} />
                </div>
              </div>
              <div className="p-3">
                <p className="text-[13px] font-bold uppercase tracking-wide text-ink group-hover:text-primary">{m.label}</p>
                <p className="text-[12px] text-muted leading-tight mt-0.5">{m.desc}</p>
                <span className="inline-flex mt-2 text-[11px] font-semibold px-2 py-1 rounded-full text-white" style={{ background: m.palette.primary }}>
                  Usar este modelo
                </span>
              </div>
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
