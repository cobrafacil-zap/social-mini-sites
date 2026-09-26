const MAP: Record<string, { label: string; cls: string; dot: string }> = {
  published: { label: "Publicado", cls: "bg-ok-50 text-ok", dot: "bg-okDot" },
  draft: { label: "Rascunho", cls: "bg-warn-50 text-warn", dot: "bg-[#F79009]" },
  disabled: { label: "Inativo", cls: "bg-paper-alt text-ink-muted", dot: "bg-[#98A2A0]" },
};

export function StatusBadge({ status, withDot = true }: { status: string; withDot?: boolean }) {
  const s = MAP[status] ?? { label: status, cls: "bg-paper-alt text-ink-muted", dot: "bg-[#98A2A0]" };
  return (
    <span className={`badge ${s.cls}`}>
      {withDot && <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />}
      {s.label}
    </span>
  );
}
