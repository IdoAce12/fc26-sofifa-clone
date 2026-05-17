/** FC26 folder on CMTracker player portraits CDN. */
export const CMTRACKER_FC_VERSION = "26";

/** CMTracker generic silhouette when a player portrait is missing. */
export const CMTRACKER_PLAYER_NOT_FOUND_URL = `https://cmtracker.ro/assets/images/players/${CMTRACKER_FC_VERSION}/0.png`;

/** Local fallback if CMTracker placeholders are unreachable. */
export const LOCAL_PLAYER_PLACEHOLDER = "/player-placeholder.svg";

/**
 * Portrait URL from `player_id` only — ignores CSV `player_face_url`.
 * CMTracker: `https://cmtracker.ro/assets/images/players/26/{playerId}.png`
 */
export function getPlayerImageUrl(playerId: number): string {
  return `https://cmtracker.ro/assets/images/players/${CMTRACKER_FC_VERSION}/${playerId}.png`;
}

export function getPlayerImageFallbacks(): string[] {
  return [CMTRACKER_PLAYER_NOT_FOUND_URL, LOCAL_PLAYER_PLACEHOLDER];
}
