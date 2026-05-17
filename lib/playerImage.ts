/** Local green silhouette when a CMTracker portrait is missing. */
export const LOCAL_PLAYER_PLACEHOLDER = "/player-placeholder.svg";

/**
 * Portrait URL from `player_id` only — ignores CSV `player_face_url`.
 * CMTracker: `https://cmtracker.ro/assets/images/players/{playerId}.webp`
 */
export function getPlayerImageUrl(playerId: number): string {
  return `https://cmtracker.ro/assets/images/players/${playerId}.webp`;
}

export function getPlayerImageFallbacks(): string[] {
  return [LOCAL_PLAYER_PLACEHOLDER];
}
