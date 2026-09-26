export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 340, height: 660 }}>
      {/* glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-[52px] opacity-60 blur-2xl"
        style={{ background: "radial-gradient(60% 55% at 50% 30%, rgb(20 92 75 / 0.10), transparent 70%)" }}
      />
      {/* corpo */}
      <div
        className="relative h-full w-full overflow-hidden rounded-[42px] bg-[#0D1110] p-[10px] shadow-pop ring-1 ring-black/10"
        style={{ boxShadow: "0 0 0 1px rgb(13 17 16 / 0.12), 0 24px 60px -12px rgb(13 17 16 / 0.28)" }}
      >
        {/* botões laterais */}
        <span aria-hidden="true" className="absolute -left-[2px] top-[150px] h-12 w-[2px] rounded-l bg-[#2A302E]" />
        <span aria-hidden="true" className="absolute -left-[2px] top-[196px] h-12 w-[2px] rounded-l bg-[#2A302E]" />
        <span aria-hidden="true" className="absolute -left-[2px] top-[242px] h-12 w-[2px] rounded-l bg-[#2A302E]" />
        <span aria-hidden="true" className="absolute -right-[2px] top-[196px] h-16 w-[2px] rounded-r bg-[#2A302E]" />

        {/* tela */}
        <div className="relative h-full w-full overflow-hidden rounded-[33px] bg-white">
          {/* notch */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 z-20 h-[22px] w-[104px] -translate-x-1/2 rounded-b-[14px] bg-[#0D1110]"
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[7px] z-20 h-[5px] w-[34px] -translate-x-1/2 rounded-full bg-[#23292A]"
          />
          <div className="no-scrollbar h-full w-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
