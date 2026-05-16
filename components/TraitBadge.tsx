type TraitBadgeProps = {
  label: string;
  variant?: "trait" | "tag";
};

export function TraitBadge({ label, variant = "trait" }: TraitBadgeProps) {
  const isPlus = label.includes("+");

  if (variant === "tag") {
    return (
      <span className="inline-flex items-center rounded-md border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-300">
        #{label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${
        isPlus
          ? "border-amber-500/40 bg-amber-500/15 text-amber-200"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      }`}
    >
      {label}
    </span>
  );
}
