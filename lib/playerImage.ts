/** FC26 game version used in SoFIFA CDN paths (e.g. `26_120.png`). */
export const FIFA_VERSION = 26;

export const PLAYER_IMAGE_PLACEHOLDER = "/player-placeholder.svg";

/** SoFIFA CDN: `https://cdn.sofifa.net/players/252/371/26_120.png` */
export function buildSofifaPlayerImageUrl(
  playerId: number,
  size: 60 | 120 = 120,
  version: number = FIFA_VERSION,
): string {
  const padded = String(playerId).padStart(6, "0");
  const part1 = padded.slice(0, 3);
  const part2 = padded.slice(3, 6);
  return `https://cdn.sofifa.net/players/${part1}/${part2}/${version}_${size}.png`;
}

function normalizeFaceUrl(url: string): string {
  let normalized = url.trim();
  if (!normalized) return normalized;
  if (normalized.startsWith("//")) {
    normalized = `https:${normalized}`;
  } else if (normalized.startsWith("http://")) {
    normalized = `https://${normalized.slice("http://".length)}`;
  }
  return normalized;
}

/** Rewrites legacy/wrong game-version suffixes on SoFIFA URLs to the current FC version. */
function fixSofifaVersionInUrl(url: string, version: number = FIFA_VERSION): string {
  if (!url.includes("cdn.sofifa.net")) return url;
  return url.replace(/\/(\d{2})_(\d+)\.png(\?.*)?$/i, `/${version}_$2.png$3`);
}

/**
 * Picks the best primary URL: canonical SoFIFA build from player_id, with CSV URL as a variant.
 */
export function resolvePlayerFaceUrl(
  playerId: number,
  rawUrl: string | null | undefined,
  version: number = FIFA_VERSION,
): string {
  const canonical = buildSofifaPlayerImageUrl(playerId, 120, version);
  if (!rawUrl?.trim()) return canonical;

  const normalized = fixSofifaVersionInUrl(normalizeFaceUrl(rawUrl), version);
  if (normalized.includes("cdn.sofifa.net")) {
    return normalized;
  }

  // EA / other hosts often block hotlinking — prefer SoFIFA CDN built from id.
  return canonical;
}

/**
 * Ordered sources for `<Image onError>` cascade (unique, placeholder last).
 */
export function getPlayerImageSources(
  playerId: number,
  rawUrl: string | null | undefined,
  version: number = FIFA_VERSION,
): string[] {
  const sources: string[] = [];
  const add = (url: string) => {
    if (url && !sources.includes(url)) sources.push(url);
  };

  add(buildSofifaPlayerImageUrl(playerId, 120, version));
  add(buildSofifaPlayerImageUrl(playerId, 60, version));

  if (rawUrl?.trim()) {
    add(fixSofifaVersionInUrl(normalizeFaceUrl(rawUrl), version));
  }

  add(
    `https://ratings-images-prod.pulse.ea.com/FC${version}/full/player-portraits/p${playerId}.png`,
  );

  add(PLAYER_IMAGE_PLACEHOLDER);
  return sources;
}
