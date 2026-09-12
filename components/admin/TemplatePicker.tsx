import { TEMPLATES } from "@/lib/templates";
import { createSite } from "@/lib/actions/sites";

export function TemplatePicker() {
  return (
    <div>
      <h1 className="text-[17px] font-semibold text-ink mb-1">Qual o segmento do cliente?</h1>
      <p className="text-[13px] text-muted mb-[18px]">
        Isso define os botões e seções sugeridas — você pode ajustar tudo depois.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {Object.entries(TEMPLATES).map(([key, t]) => (
          <form key={key} action={createSite}>
            <input type="hidden" name="template" value={key} />
            <button
              type="submit"
              className="w-full border border-line rounded-xl p-4 bg-[#FAFAF7] cursor-pointer text-left flex flex-col gap-2 hover:border-primary transition"
            >
              <t.icon size={20} color="#145C4B" />
              <span className="text-[13.5px] font-semibold text-ink">{t.label}</span>
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}