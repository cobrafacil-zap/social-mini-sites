export default function AdminLoading() {
  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 sm:py-8" aria-busy="true" aria-label="Carregando">
      {/* cabeçalho */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-56 animate-pulse rounded-lg bg-paper-alt" />
          <div className="h-3.5 w-72 animate-pulse rounded bg-paper-alt" />
        </div>
        <div className="h-9 w-36 animate-pulse rounded-[10px] bg-paper-alt" />
      </div>

      {/* métricas */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card space-y-3 p-4">
            <div className="flex items-start justify-between">
              <div className="h-2.5 w-20 animate-pulse rounded bg-paper-alt" />
              <div className="h-7 w-7 animate-pulse rounded-[9px] bg-paper-alt" />
            </div>
            <div className="h-7 w-12 animate-pulse rounded bg-paper-alt" />
            <div className="h-2.5 w-24 animate-pulse rounded bg-paper-alt" />
          </div>
        ))}
      </div>

      {/* conteúdo */}
      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-3.5 sm:px-5">
              <div className="h-3.5 w-32 animate-pulse rounded bg-paper-alt" />
              <div className="h-8 w-40 animate-pulse rounded-[9px] bg-paper-alt" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-line px-4 py-3.5 last:border-0 sm:px-5">
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-[10px] bg-paper-alt" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-44 animate-pulse rounded bg-paper-alt" />
                  <div className="h-2.5 w-32 animate-pulse rounded bg-paper-alt" />
                </div>
                <div className="hidden h-6 w-16 animate-pulse rounded-full bg-paper-alt md:block" />
                <div className="h-8 w-20 animate-pulse rounded-[9px] bg-paper-alt" />
              </div>
            ))}
          </div>
          <div className="panel space-y-4 p-5">
            <div className="h-3.5 w-48 animate-pulse rounded bg-paper-alt" />
            <div className="h-[150px] animate-pulse rounded-[10px] bg-paper-alt" />
          </div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="panel space-y-3 p-5">
              <div className="h-3.5 w-36 animate-pulse rounded bg-paper-alt" />
              <div className="h-2.5 w-24 animate-pulse rounded bg-paper-alt" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-11 animate-pulse rounded-[10px] bg-paper-alt" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
