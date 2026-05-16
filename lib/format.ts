/** Format EUR values like scouting sites: €174.5M, €320K */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `€${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    return `€${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(0)}K`;
  }
  return `€${value.toLocaleString("en-GB")}`;
}

/** Render star rating e.g. ★★★★☆ */
export function formatStars(rating: number | null | undefined, max = 5): string {
  if (rating == null || rating < 1) return "—";
  const filled = Math.min(max, Math.max(1, Math.round(rating)));
  return "★".repeat(filled) + "☆".repeat(max - filled);
}

/** Split comma-separated traits/tags into clean badge labels */
export function parseBadgeList(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim().replace(/^#/, ""))
    .filter(Boolean);
}
