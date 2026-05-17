/** Local green silhouette when an EA portrait is missing. */
export const LOCAL_PLAYER_PLACEHOLDER = "/player-placeholder.svg";

/**
 * Portrait URL from `player_id` only — ignores CSV `player_face_url`.
 * EA FC26: `https://images.ut.ea.com/game-assets/fc26/fc_player_headshots/{playerId}.png`
 */
export function getPlayerImageUrl(playerId: number): string {
  return `https://images.ut.ea.com/game-assets/fc26/fc_player_headshots/${playerId}.png`;
}

export function getPlayerImageFallbacks(): string[] {
  return [LOCAL_PLAYER_PLACEHOLDER];
}
