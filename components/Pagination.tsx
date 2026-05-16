type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-white/5 bg-pitch-800/40 px-4 py-3 sm:flex-row">
      <p className="text-sm text-zinc-500">
        Showing{" "}
        <span className="font-medium text-zinc-300">
          {start.toLocaleString()}–{end.toLocaleString()}
        </span>{" "}
        of <span className="font-medium text-zinc-300">{total.toLocaleString()}</span>{" "}
        players
      </p>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="touch-target flex-1 rounded-lg border border-white/10 bg-pitch-700 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-accent/40 hover:bg-pitch-700/80 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:py-2"
        >
          Previous
        </button>
        <span className="min-w-[4.5rem] shrink-0 text-center text-sm tabular-nums text-zinc-400">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="touch-target flex-1 rounded-lg border border-white/10 bg-pitch-700 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-accent/40 hover:bg-pitch-700/80 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:py-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}
