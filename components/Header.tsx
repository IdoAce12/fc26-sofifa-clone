export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-pitch-900/90 backdrop-blur-md safe-top">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-dim shadow-glow sm:h-10 sm:w-10">
            <span className="text-base font-black text-pitch-950 sm:text-lg">26</span>
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight text-white sm:text-2xl">
              FC26 Scout
            </h1>
            <p className="hidden text-xs text-zinc-500 xs:block sm:text-sm">
              EA Sports FC 26 · Player Database
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 text-[10px] font-medium text-emerald-400 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="hidden xs:inline">18,405 live</span>
          <span className="xs:hidden">Live</span>
        </div>
      </div>
    </header>
  );
}
