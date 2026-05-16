import { pool } from "./db";

export type PlayerRow = {
  player_id: number;
  short_name: string;
  long_name: string | null;
  player_positions: string | null;
  overall: number;
  potential: number;
  age: number | null;
  club_name: string | null;
  player_face_url: string | null;
};

export type PlayerDetail = {
  player_id: number;
  player_url: string | null;
  short_name: string;
  long_name: string | null;
  player_positions: string | null;
  overall: number;
  potential: number;
  value_eur: number | null;
  wage_eur: number | null;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  club_name: string | null;
  league_name: string | null;
  nationality_name: string | null;
  preferred_foot: string | null;
  weak_foot: number | null;
  skill_moves: number | null;
  player_face_url: string | null;
  pace: number | null;
  shooting: number | null;
  passing: number | null;
  dribbling: number | null;
  defending: number | null;
  physic: number | null;
  player_traits: string | null;
  player_tags: string | null;
};

export type PlayerFilters = {
  q?: string;
  overallMin?: number;
  overallMax?: number;
  potentialMin?: number;
  potentialMax?: number;
  ageMin?: number;
  ageMax?: number;
  position?: string;
  club?: string;
  page?: number;
  limit?: number;
};

export type PlayersResult = {
  players: PlayerRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const SELECT_FIELDS = `
  player_id,
  short_name,
  long_name,
  player_positions,
  overall,
  potential,
  age,
  club_name,
  player_face_url
`;

function parseIntParam(value: string | null | undefined): number | undefined {
  if (value == null || value === "") return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : undefined;
}

export function parsePlayerFilters(
  searchParams: URLSearchParams
): PlayerFilters {
  return {
    q: searchParams.get("q")?.trim() || undefined,
    overallMin: parseIntParam(searchParams.get("overallMin")),
    overallMax: parseIntParam(searchParams.get("overallMax")),
    potentialMin: parseIntParam(searchParams.get("potentialMin")),
    potentialMax: parseIntParam(searchParams.get("potentialMax")),
    ageMin: parseIntParam(searchParams.get("ageMin")),
    ageMax: parseIntParam(searchParams.get("ageMax")),
    position: searchParams.get("position")?.trim() || undefined,
    club: searchParams.get("club")?.trim() || undefined,
    page: Math.max(1, parseIntParam(searchParams.get("page")) ?? 1),
    limit: Math.min(
      50,
      Math.max(1, parseIntParam(searchParams.get("limit")) ?? 25)
    ),
  };
}

function buildWhereClause(filters: PlayerFilters) {
  const conditions: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  const add = (sql: string, value: unknown) => {
    conditions.push(sql.replace("$IDX", `$${idx}`));
    values.push(value);
    idx += 1;
  };

  if (filters.q) {
    add("short_name ILIKE $IDX", `%${filters.q}%`);
  }
  if (filters.overallMin != null) {
    add("overall >= $IDX", filters.overallMin);
  }
  if (filters.overallMax != null) {
    add("overall <= $IDX", filters.overallMax);
  }
  if (filters.potentialMin != null) {
    add("potential >= $IDX", filters.potentialMin);
  }
  if (filters.potentialMax != null) {
    add("potential <= $IDX", filters.potentialMax);
  }
  if (filters.ageMin != null) {
    add("age >= $IDX", filters.ageMin);
  }
  if (filters.ageMax != null) {
    add("age <= $IDX", filters.ageMax);
  }
  if (filters.position) {
    add("player_positions ILIKE $IDX", `%${filters.position}%`);
  }
  if (filters.club) {
    add("club_name ILIKE $IDX", `%${filters.club}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  return { where, values };
}

export async function queryPlayers(
  filters: PlayerFilters
): Promise<PlayersResult> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 25;
  const offset = (page - 1) * limit;

  const { where, values } = buildWhereClause(filters);

  const countResult = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM players ${where}`,
    values
  );
  const total = Number.parseInt(countResult.rows[0]?.count ?? "0", 10);

  const dataValues = [...values, limit, offset];
  const limitIdx = values.length + 1;
  const offsetIdx = values.length + 2;

  const dataResult = await pool.query<PlayerRow>(
    `SELECT ${SELECT_FIELDS}
     FROM players
     ${where}
     ORDER BY overall DESC, potential DESC, short_name ASC
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    dataValues
  );

  return {
    players: dataResult.rows,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getPlayerById(playerId: number): Promise<PlayerDetail | null> {
  const result = await pool.query<PlayerDetail>(
    `SELECT
      player_id,
      player_url,
      short_name,
      long_name,
      player_positions,
      overall,
      potential,
      value_eur,
      wage_eur,
      age,
      height_cm,
      weight_kg,
      club_name,
      league_name,
      nationality_name,
      preferred_foot,
      weak_foot,
      skill_moves,
      player_face_url,
      pace,
      shooting,
      passing,
      dribbling,
      defending,
      physic,
      player_traits,
      player_tags
    FROM players
    WHERE player_id = $1`,
    [playerId]
  );
  return result.rows[0] ?? null;
}

export async function queryFilterOptions() {
  const [clubsResult, positionsResult] = await Promise.all([
    pool.query<{ club_name: string }>(
      `SELECT DISTINCT club_name
       FROM players
       WHERE club_name IS NOT NULL AND club_name <> ''
       ORDER BY club_name ASC`
    ),
    pool.query<{ player_positions: string }>(
      `SELECT player_positions FROM players WHERE player_positions IS NOT NULL`
    ),
  ]);

  const positionSet = new Set<string>();
  for (const row of positionsResult.rows) {
    for (const part of row.player_positions.split(",")) {
      const pos = part.trim();
      if (pos) positionSet.add(pos);
    }
  }

  const positions = Array.from(positionSet).sort((a, b) => a.localeCompare(b));

  return {
    clubs: clubsResult.rows.map((r) => r.club_name),
    positions,
  };
}
