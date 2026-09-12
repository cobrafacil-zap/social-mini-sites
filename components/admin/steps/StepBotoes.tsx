"use client";

import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import type { Site, Button, IconName } from "@/lib/types";
import { ICON_OPTIONS } from "@/lib/templates";
import { nanoid } from "nanoid";

export function StepBotoes({ site, set }: { site: Site; set: (p: string, v: unknown) => void }) {
  function update(id: string, field: keyof Button, value: unknown) {
    set("buttons", site.buttons.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  }
  function add() {
    const next: Button = {
      id: `btn_${nanoid(6)}`,
      name: "",
      icon: "star" as IconName,
      link: "",
      order: site.buttons.length,
    };
    set("buttons", [...site.buttons, next]);
  }
  function remove(id: string) {
    set("buttons", site.buttons.filter((b) => b.id !== id));
  }
  function move(id: string, dir: -1 | 1) {
    const arr = [...site.buttons].sort((a, b) => a.order - b.order);
    const i = arr.findIndex((b) => b.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i].order, arr[j].order] = [arr[j].order, arr[i].order];
    set("buttons", arr);
  }

  const sorted = [...site.buttons].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h2 style={sectionTitle}>Botões comerciais</h2>
      <p className="text-[13px] text-muted mb-3.5">
        Ex: Solicitar orçamento, Ver cardápio, Fazer pedido, Agendar horário…
      </p>
      {sorted.map((b) => (
        <div key={b.id} className="border border-line rounded-[10px] p-3 mb-2.5">
          <div className="grid grid-cols-[2fr_1fr_2fr_auto] gap-2 items-center">
            <input
              className="input-base"
              value={b.name}
              onChange={(e) => update(b.id, "name", e.target.value)}
              placeholder="Nome do botão"
            />
            <select
              className="input-base"
              value={b.icon}
              onChange={(e) => update(b.id, "icon", e.target.value as IconName)}
            >
              {ICON_OPTIONS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <input
              className="input-base"
              value={b.link}
              onChange={(e) => update(b.id, "link", e.target.value)}
              placeholder="Link (https://...)"
            />
            <div className="flex gap-1">
              <button type="button" onClick={() => move(b.id, -1)} className="icon-btn-sm" aria-label="Subir">
                <ChevronLeft size={13} style={{ transform: "rotate(90deg)" }} />
              </button>
              <button type="button" onClick={() => move(b.id, 1)} className="icon-btn-sm" aria-label="Descer">
                <ChevronLeft size={13} style={{ transform: "rotate(-90deg)" }} />
              </button>
              <button type="button" onClick={() => remove(b.id)} className="icon-btn-sm" style={{ color: "#9C3B31" }} aria-label="Remover">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1 text-[13px] text-neutral-700 bg-white border border-line rounded-lg py-2 px-3.5 cursor-pointer"
      >
        <Plus size={14} /> Adicionar botão
      </button>

      <style>{`.icon-btn-sm{width:30px;height:30px;border-radius:8px;border:1px solid #E7E6E1;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#3A3D38}`}</style>
    </div>
  );
}

const sectionTitle = { fontSize: 17, fontWeight: 600, color: "#181A17", marginBottom: 18 } as const;