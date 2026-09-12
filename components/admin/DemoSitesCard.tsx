import { createDemoSite } from "@/lib/actions/sites";
import { Sparkles, UtensilsCrossed, ShoppingBag, Briefcase, User, Plus } from "lucide-react";

const DEMOS: { key: "restaurante" | "loja" | "servicos" | "profissional"; label: string; company: string; Icon: React.ComponentType<{ size?: number; color?: string }>; color: string }[] = [
  { key: "restaurante", label: "Restaurante", company: "Villa Itália",                  Icon: UtensilsCrossed, color: "#145C4B" },
  { key: "loja",        label: "Loja",        company: "Boutique Flor de Lis",          Icon: ShoppingBag,     color: "#3B2A4A" },
  { key: "servicos",    label: "Serviços",    company: "LVR Eletricista",               Icon: Briefcase,       color: "#0B3D91" },
  { key: "profissional",label: "Profissional",company: "Dra. Helena Costa",             Icon: User,            color: "#5B6F4A" },
];

export function DemoSitesCard() {
  return (
    <div className="bg-white border border-line rounded-xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-primary" />
        <h3 className="text-[14px] font-semibold text-ink">Comece com um exemplo pronto</h3>
      </div>
      <p className="text-[12.5px] text-muted mb-3.5">
        Cria um site já publicado, com capa, galeria, horários e botões configurados — você só customiza depois.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {DEMOS.map(({ key, label, company, Icon, color }) => (
          <form key={key} action={createDemoSite}>
            <input type="hidden" name="template" value={key} />
            <button
              type="submit"
              className="w-full border border-line rounded-lg p-2.5 bg-[#FAFAF7] hover:border-primary transition text-left flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${color}1A` }}>
                <Icon size={15} color={color} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-ink truncate">{company}</p>
                <p className="text-[10.5px] text-muted truncate">{label}</p>
              </div>
              <Plus size={13} className="text-muted flex-shrink-0" />
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
