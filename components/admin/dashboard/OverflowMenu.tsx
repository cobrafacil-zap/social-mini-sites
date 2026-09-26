"use client";

import { useEffect, useRef, useState } from "react";
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

export function OverflowMenu({
  items, label = "Mais ações",
}: { items: Item[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <span className="tip-wrap">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={label}
          className="icon-btn"
        >
          <MoreHorizontal size={16} />
        </button>
        <span className="tip" role="tooltip">{label}</span>
      </span>

      {open && (
        <div className="menu" role="menu">
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
        </div>
      )}
    </div>
  );
}
