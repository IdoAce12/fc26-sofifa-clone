type RatingBadgeProps = {
  value: number;
  label?: string;
};

function ratingStyle(value: number) {
  if (value >= 80) {
    return "bg-emerald-500/20 text-emerald-300 ring-emerald-500/40";
  }
  if (value >= 70) {
    return "bg-amber-500/20 text-amber-300 ring-amber-500/40";
  }
  if (value >= 60) {
    return "bg-sky-500/15 text-sky-300 ring-sky-500/30";
  }
  return "bg-zinc-500/20 text-zinc-400 ring-zinc-500/30";
}

export function RatingBadge({ value, label }: RatingBadgeProps) {
  return (
    <span
      className={`inline-flex min-w-[2.25rem] items-center justify-center rounded-md px-2 py-0.5 text-sm font-bold tabular-nums ring-1 ${ratingStyle(value)}`}
      title={label}
    >
      {value}
    </span>
  );
}
