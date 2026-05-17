/** Local green silhouette when an EA portrait is missing. */
export const LOCAL_PLAYER_PLACEHOLDER = "/player-placeholder.svg";

/**
 * Portrait URL from `player_id` only — ignores CSV `player_face_url`.
 * EA FC26 CDN: `https://eafc.assets.ea.com/fc26/set-1/players/{playerId}.png`
 */
export function getPlayerImageUrl(playerId: number): string {
  return `https://eafc.assets.ea.com/fc26/set-1/players/${playerId}.png`;
}

export function getPlayerImageFallbacks(): string[] {
  return [LOCAL_PLAYER_PLACEHOLDER];
}
