/** SoFIFA generic silhouette (requested fallback). */
export const SOFIFA_PLAYER_NOT_FOUND_URL =
  "https://cdn.sofifa.net/players/notfound_0.png";

/** Live CDN fallback when `notfound_0.png` is unavailable. */
export const SOFIFA_PLAYER_NOT_FOUND_URL_ALT =
  "https://cdn.sofifa.net/players/notfound_0_120.png";

/**
 * Portrait URL from `player_id` only — ignores CSV `player_face_url`.
 * SoFIFA FC26 CDN: `https://cdn.sofifa.net/players/252/371/26_120.png`
 */
export function getPlayerImageUrl(playerId: number): string {
  const padded = String(playerId).padStart(6, "0");
  const part1 = padded.slice(0, 3);
  const part2 = padded.slice(3, 6);
  return `https://cdn.sofifa.net/players/${part1}/${part2}/26_120.png`;
}

export function getPlayerImageFallbacks(): string[] {
  return [SOFIFA_PLAYER_NOT_FOUND_URL, SOFIFA_PLAYER_NOT_FOUND_URL_ALT];
}
