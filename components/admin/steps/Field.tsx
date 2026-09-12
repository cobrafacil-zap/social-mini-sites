"use client";

export function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block mb-4">
      <span className="block text-[13px] font-medium text-neutral-700 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[12px] text-[#8B8B85] mt-1">{hint}</span>}
    </label>
  );
}