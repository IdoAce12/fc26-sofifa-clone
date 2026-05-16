type StatCircleProps = {
  label: string;
  value: number | null;
  colorClass: string;
  ringClass: string;
};

export function StatCircle({
  label,
  value,
  colorClass,
  ringClass,
}: StatCircleProps) {
  const display = value != null ? value : "—";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-pitch-900 ring-[3px] ${ringClass} sm:h-24 sm:w-24 sm:ring-4`}
      >
        <span
          className={`text-xl font-black tabular-nums sm:text-3xl ${value != null ? colorClass : "text-zinc-600"}`}
        >
          {display}
        </span>
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </span>
    </div>
  );
}
