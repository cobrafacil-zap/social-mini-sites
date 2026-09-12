export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3 bg-paper">
      <p className="text-[15px] text-neutral-700">Este mini site não está disponível.</p>
      <a href="/admin" className="text-[13px] text-muted underline">Voltar ao painel</a>
    </div>
  );
}