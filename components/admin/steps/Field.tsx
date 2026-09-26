"use client";

export function Field({
  label, hint, children, className = "",
}: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </label>
  );
}

export function StepHeader({
  title, description, icon: Icon,
}: { title: string; description: string; icon?: React.ComponentType<{ size?: number }> }) {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-primary-50 text-primary">
            <Icon size={16} />
          </span>
        )}
        <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">{title}</h2>
      </div>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{description}</p>
    </header>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7 border-t border-line pt-6">
      <h3 className="mb-3.5 text-[12px] font-semibold uppercase tracking-wide text-ink-muted">
        {title}
      </h3>
      {children}
    </section>
  );
}
