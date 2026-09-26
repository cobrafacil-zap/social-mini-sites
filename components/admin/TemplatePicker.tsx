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
  palette: { primary: string; secondary: string; bg: string; text: string };
};

const MODELS: Model[] = [
  {
    id: "villa-classico",
    label: "Restaurante Clássico",
    desc: "Vinho e dourado — pizzaria e restaurante",
    template: "restaurante",
    Icon: UtensilsCrossed,
    palette: { primary: "#9B1B30", secondary: "#E9C46A", bg: "#FFF8F0", text: "#1A1A1A" },
  },
  {
    id: "burger-moderno",
    label: "Restaurante Moderno",
    desc: "Preto e vermelho — hamburgueria e bar",
    template: "restaurante",
    Icon: UtensilsCrossed,
    palette: { primary: "#111111", secondary: "#E30613", bg: "#FFFFFF", text: "#111111" },
  },
  {
    id: "boutique-elegante",
    label: "Loja Elegante",
    desc: "Roxo sofisticado — boutique e moda",
    template: "loja",
    Icon: ShoppingBag,
    palette: { primary: "#3B2A4A", secondary: "#D4A5C4", bg: "#FAF6F2", text: "#1A1410" },
  },
  {
    id: "loja-urbana",
    label: "Loja Urbana",
    desc: "Preto e neon — streetwear e sneakers",
    template: "loja",
    Icon: ShoppingBag,
    palette: { primary: "#0A0A0A", secondary: "#00E676", bg: "#FFFFFF", text: "#0A0A0A" },
  },
  {
    id: "servico-tecnico",
    label: "Serviços Técnico",
    desc: "Azul e amarelo — oficina e eletricista",
    template: "servicos",
    Icon: Briefcase,
    palette: { primary: "#0B3D91", secondary: "#FFB400", bg: "#FFFFFF", text: "#0A0A0A" },
  },
  {
    id: "servico-premium",
    label: "Serviços Premium",
    desc: "Preto e dourado — clínica e estética",
    template: "servicos",
    Icon: Briefcase,
    palette: { primary: "#0A0A0A", secondary: "#D9A441", bg: "#FFFBF5", text: "#1E1B2E" },
  },
  {
    id: "saude-bemestar",
    label: "Saúde e Bem-estar",
    desc: "Verde sálvia — psicóloga e nutri",
    template: "profissional",
    Icon: User,
    palette: { primary: "#5B6F4A", secondary: "#E8B4A0", bg: "#F8F5F0", text: "#1A1A1A" },
  },
  {
    id: "corporativo",
    label: "Corporativo",
    desc: "Marinho e ouro — advocacia e contabilidade",
    template: "profissional",
    Icon: User,
    palette: { primary: "#0F2A44", secondary: "#C5A254", bg: "#F8F6F1", text: "#0F172A" },
  },
];

export function TemplatePicker() {
  const [useSeed, setUseSeed] = useState(true);

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink sm:text-[26px]">
          Escolha um modelo
        </h1>
        <p className="mt-1 text-[13.5px] text-muted">
          São 8 modelos prontos. Escolha o visual que combina com o cliente — depois você preenche as informações.
        </p>
      </header>

      <label className="mb-5 flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-3 transition duration-150 hover:border-line-strong">
        <input
          type="checkbox"
          checked={useSeed}
          onChange={(e) => setUseSeed(e.target.checked)}
          className="cursor-pointer"
        />
        <Sparkles size={14} className="shrink-0 text-primary" />
        <span className="text-[13px] text-ink-soft">
          Preencher com <strong className="font-semibold text-ink">exemplo completo</strong> do segmento
          <span className="block text-[11.5px] text-muted">Capa, galeria, horários e botões já vêm prontos.</span>
        </span>
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MODELS.map((m) => (
          <form key={m.id} action={createSite} className="contents">
            <input type="hidden" name="template" value={m.template} />
            <input type="hidden" name="modelId" value={m.id} />
            {useSeed && <input type="hidden" name="useSeed" value="on" />}
            <button
              type="submit"
              className="group card card-hover flex w-full flex-col overflow-hidden text-left active:scale-[0.99]"
            >
              <div className="relative h-[104px] shrink-0 overflow-hidden border-b border-line" style={{ background: m.palette.bg }}>
                <div className="absolute inset-x-0 top-0 h-[38px]" style={{ background: m.palette.primary }} />
                <div
                  className="absolute left-2.5 top-[24px] flex h-8 w-8 items-center justify-center rounded-[9px] shadow-sm"
                  style={{ background: "#fff", border: `2px solid ${m.palette.bg}` }}
                >
                  <m.Icon size={13} color={m.palette.primary} />
                </div>
                <div className="absolute bottom-2 left-2.5 right-2.5 flex gap-1">
                  <span className="h-1.5 flex-1 rounded-full" style={{ background: m.palette.primary, opacity: 0.18 }} />
                  <span className="h-1.5 w-10 rounded-full" style={{ background: m.palette.secondary }} />
                </div>
                <div className="absolute right-2 top-2 flex gap-1">
                  {[m.palette.primary, m.palette.secondary, m.palette.text].map((col, i) => (
                    <span key={i} className="h-2.5 w-2.5 rounded-full border border-white/40" style={{ background: col }} />
                  ))}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-3">
                <p className="text-[13px] font-semibold tracking-[-0.01em] text-ink transition-colors duration-150 group-hover:text-primary">
                  {m.label}
                </p>
                <p className="mt-1 text-[11.5px] leading-snug text-muted">{m.desc}</p>
                <span
                  className="mt-3 self-start rounded-full px-2.5 py-1 text-[11px] font-semibold text-white transition duration-150"
                  style={{ background: m.palette.primary }}
                >
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
