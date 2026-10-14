"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";

type Item = {
  key: string;
  label: string;
  onSelect?: () => void;
  href?: string;
  external?: boolean;
  danger?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  disabledReason?: string;
};

/** Largura do menu flutuante. */
const MENU_WIDTH = 224;
/** Altura estimada por item — usada só para decidir se abre para cima. */
const ITEM_HEIGHT = 37;

export function OverflowMenu({
  items, label = "Mais ações",
}: { items: Item[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const id = useId();

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;

    // O menu é renderizado num portal (fora da lista), então nunca é
    // cortado pelo `overflow-hidden` do painel — era isso que escondia as
    // últimas opções nas linhas de baixo. Se não couber embaixo, abre para
    // cima; se não couber à direita, encosta na borda da tela.
    const estimated = items.length * ITEM_HEIGHT + 12;
    const fitsBelow = rect.bottom + 6 + estimated <= window.innerHeight - 8;
    const top = fitsBelow
      ? rect.bottom + 6
      : Math.max(8, rect.top - 6 - estimated);
    const left = Math.max(
      8,
      Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8),
    );

    // Fecha qualquer outro menu aberto antes de abrir este.
    window.dispatchEvent(new CustomEvent("ms:menu-open", { detail: id }));
    setPos({ top, left });
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const closeOthers = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    // Fecha ao rolar/redimensionar para o menu não ficar deslocado do botão.
    const onScroll = () => setOpen(false);
    window.addEventListener("ms:menu-open", closeOthers);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("ms:menu-open", closeOthers);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, id]);

  return (
    <div className="relative">
      <span className="tip-wrap">
        <button
          ref={btnRef}
          type="button"
          onClick={toggle}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={label}
          className="icon-btn"
        >
          <MoreHorizontal size={16} />
        </button>
        {!open && (
          <span className="tip" role="tooltip">{label}</span>
        )}
      </span>

      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={label}
            className="menu animate-slideDown"
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              right: "auto",
              bottom: "auto",
              margin: 0,
              width: MENU_WIDTH,
              maxHeight: "calc(100dvh - 16px)",
              overflowY: "auto",
            }}
          >
            {items.map((it) => {
              const cls = `menu-item ${it.danger ? "text-danger hover:bg-danger-50" : ""} ${
                it.disabled ? "cursor-not-allowed opacity-45" : ""
              }`;
              const inner = (
                <>
                  {it.icon && <span className="shrink-0 opacity-70">{it.icon}</span>}
                  <span className="min-w-0 flex-1 truncate text-left">{it.label}</span>
                  {it.disabled && it.disabledReason && (
                    <span className="shrink-0 text-[10.5px] uppercase tracking-wide text-muted">
                      {it.disabledReason}
                    </span>
                  )}
                </>
              );

              if (it.disabled) {
                return (
                  <span key={it.key} className={cls} role="menuitem" aria-disabled="true">
                    {inner}
                  </span>
                );
              }
              if (it.href) {
                return (
                  <a
                    key={it.key}
                    href={it.href}
                    role="menuitem"
                    className={cls}
                    {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={() => setOpen(false)}
                  >
                    {inner}
                  </a>
                );
              }
              return (
                <button
                  key={it.key}
                  type="button"
                  role="menuitem"
                  className={cls}
                  onClick={() => {
                    setOpen(false);
                    it.onSelect?.();
                  }}
                >
                  {inner}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
