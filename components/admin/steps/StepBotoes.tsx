"use client";

import { ChevronUp, ChevronDown, Plus, Trash2, MousePointerClick, GripVertical } from "lucide-react";
import type { Site, Button, IconName } from "@/lib/types";
import { ICONS, ICON_OPTIONS } from "@/lib/templates";
import { nanoid } from "nanoid";
import { StepHeader } from "./Field";

const ICON_LABEL: Record<string, string> = {
  whatsapp: "WhatsApp", map: "Localização", phone: "Telefone", instagram: "Instagram",
  facebook: "Facebook", globe: "Site", menu: "Cardápio", calendar: "Agenda",
  tag: "Oferta", cart: "Carrinho", briefcase: "Orçamento", image: "Portfólio",
  star: "Destaque", bag: "Loja", shoppingBag: "Compras",
};

export function StepBotoes({ site, set }: { site: Site; set: (p: string, v: unknown) => void }) {
  function update(id: string, field: keyof Button, value: unknown) {
    set("buttons", site.buttons.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  }
  function add() {
    const next: Button = { id: `btn_${nanoid(6)}`, name: "", icon: "star" as IconName, link: "", order: site.buttons.length };
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
    [arr[i]!.order, arr[j]!.order] = [arr[j]!.order, arr[i]!.order];
    set("buttons", arr);
  }

  const sorted = [...site.buttons].sort((a, b) => a.order - b.order);

  return (
    <div>
      <StepHeader
        icon={MousePointerClick}
        title="Botões comerciais"
        description="Cada botão vira um atalho no mini site. Ex.: Ver cardápio, Reservar mesa, Solicitar orçamento."
      />

      {sorted.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line-strong bg-paper px-4 py-8 text-center text-[12.5px] text-muted">
          Nenhum botão ainda. Clique em “Adicionar botão” para começar.
        </p>
      ) : (
        <ul className="space-y-2">
          {sorted.map((b, i) => {
            const Icon = ICONS[b.icon] ?? ICONS.star!;
            return (
              <li key={b.id} className="rounded-xl border border-line bg-white p-3 transition-shadow duration-150 hover:shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-primary-50 text-primary">
                    <Icon size={15} />
                  </span>

                  <input
                    className="input-base min-w-0 flex-1"
                    value={b.name}
                    onChange={(e) => update(b.id, "name", e.target.value)}
                    placeholder="Nome do botão"
                    aria-label="Nome do botão"
                  />

                  <select
                    className="input-base w-[136px] shrink-0"
                    value={b.icon}
                    onChange={(e) => update(b.id, "icon", e.target.value as IconName)}
                    aria-label="Ícone do botão"
                  >
                    {ICON_OPTIONS.map((k) => (
                      <option key={k} value={k}>{ICON_LABEL[k] ?? k}</option>
                    ))}
                  </select>

                  <div className="flex shrink-0 items-center gap-0.5">
                    <span className="icon-btn h-7 w-7 cursor-grab opacity-30" aria-hidden="true">
                      <GripVertical size={14} />
                    </span>
                    <button
                      type="button"
                      onClick={() => move(b.id, -1)}
                      disabled={i === 0}
                      className="icon-btn h-7 w-7"
                      style={{ opacity: i === 0 ? 0.3 : 1 }}
                      aria-label="Mover para cima"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(b.id, 1)}
                      disabled={i === sorted.length - 1}
                      className="icon-btn h-7 w-7"
                      style={{ opacity: i === sorted.length - 1 ? 0.3 : 1 }}
                      aria-label="Mover para baixo"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(b.id)}
                      className="icon-btn icon-btn-danger h-7 w-7"
                      aria-label="Remover botão"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <input
                  className="input-base mt-2.5"
                  value={b.link}
                  onChange={(e) => update(b.id, "link", e.target.value)}
                  placeholder="https://... (deixe vazio para apenas registrar o clique)"
                  aria-label={`Link do botão ${b.name || i + 1}`}
                />
              </li>
            );
          })}
        </ul>
      )}

      <button type="button" onClick={add} className="btn-secondary mt-3">
        <Plus size={15} /> Adicionar botão
      </button>
    </div>
  );
}
