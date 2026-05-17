import { pool } from "./db";

/** Broad squad buckets used for gap analysis and transfer grouping. */
export type PositionGroup = "GK" | "DEF" | "MID" | "ATT";

export type SquadPlayer = {
  player_id: number;
  short_name: string;
  long_name: string | null;
  player_positions: string | null;
  overall: number;
  potential: number;
  age: number | null;
  value_eur: number | null;
  wage_eur: number | null;
  club_name: string | null;
  league_name: string | null;
};

export type TransferTarget = {
  player_id: number;
  short_name: string;
  long_name: string | null;
  player_positions: string | null;
  overall: number;
  potential: number;
  age: number | null;
  club_name: string | null;
  league_name: string | null;
  value_eur: number | null;
  wage_eur: number | null;
  sourceClubAvgOvr: number;
  badges: string[];
  ovrUpgrade: number;
  growthGap: number;
};

export type SquadWeakness = {
  group: PositionGroup;
  title: string;
  avgOvr: number;
  avgAge: number;
  depth: number;
  gapToStandard: number;
  issues: string[];
  currentPlayers: { short_name: string; overall: number; age: number | null }[];
};

export type PositionRecommendations = {
  group: PositionGroup;
  title: string;
  targets: TransferTarget[];
};

export type TransferScoutResult = {
  clubName: string;
  squadSize: number;
  tier: {
    top11AvgOvr: number;
    top11AvgPot: number;
    squadAvgOvr: number;
    leagueName: string | null;
  };
  weaknesses: SquadWeakness[];
  recommendations: PositionRecommendations[];
};

const POSITION_GROUP_MAP: Record<string, PositionGroup> = {
  GK: "GK",
  CB: "DEF",
  LCB: "DEF",
  RCB: "DEF",
  LB: "DEF",
  RB: "DEF",
  LWB: "DEF",
  RWB: "DEF",
  CDM: "MID",
  CM: "MID",
  CAM: "MID",
  LM: "MID",
  RM: "MID",
  LCM: "MID",
  RCM: "MID",
  LDM: "MID",
  RDM: "MID",
  LAM: "MID",
  RAM: "MID",
  ST: "ATT",
  CF: "ATT",
  LW: "ATT",
  RW: "ATT",
  LF: "ATT",
  RF: "ATT",
  LS: "ATT",
  RS: "ATT",
};

const GROUP_POSITIONS: Record<PositionGroup, string[]> = {
  GK: ["GK"],
  DEF: ["CB", "LCB", "RCB", "LB", "RB", "LWB", "RWB"],
  MID: ["CDM", "CM", "CAM", "LM", "RM", "LCM", "RCM", "LDM", "RDM", "LAM", "RAM"],
  ATT: ["ST", "CF", "LW", "RW", "LF", "RF", "LS", "RS"],
};

const GROUP_TITLES: Record<PositionGroup, string> = {
  GK: "Goalkeeper Upgrade Options",
  DEF: "Defensive Reinforcements",
  MID: "Midfield Enhancements",
  ATT: "Suggested Striker Alternatives",
};

const OVR_RANGE_SPREAD = 5;
const MAX_WEAKNESS_GROUPS = 3;
const TARGETS_PER_GROUP = 6;
const AGING_THRESHOLD = 31;
const THIN_DEPTH: Record<PositionGroup, number> = {
  GK: 1,
  DEF: 3,
  MID: 3,
  ATT: 2,
};

export function parsePositions(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((p) => p.trim().toUpperCase())
    .filter(Boolean);
}

export function getPrimaryPosition(raw: string | null | undefined): string | null {
  return parsePositions(raw)[0] ?? null;
}

export function getPositionGroup(raw: string | null | undefined): PositionGroup | null {
  const primary = getPrimaryPosition(raw);
  if (!primary) return null;
  return POSITION_GROUP_MAP[primary] ?? null;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function topNByOverall(players: SquadPlayer[], n: number): SquadPlayer[] {
  return [...players].sort((a, b) => b.overall - a.overall).slice(0, n);
}

export function analyzeSquadTier(squad: SquadPlayer[]) {
  const top11 = topNByOverall(squad, 11);
  const fallback = topNByOverall(squad, Math.min(squad.length, 11));

  const basis = top11.length >= 8 ? top11 : fallback;

  return {
    top11AvgOvr: Math.round(average(basis.map((p) => p.overall)) * 10) / 10,
    top11AvgPot: Math.round(average(basis.map((p) => p.potential)) * 10) / 10,
    squadAvgOvr: Math.round(average(squad.map((p) => p.overall)) * 10) / 10,
    leagueName: squad.find((p) => p.league_name)?.league_name ?? null,
  };
}

export function identifyWeaknesses(
  squad: SquadPlayer[],
  clubStandardOvr: number,
): SquadWeakness[] {
  const grouped: Record<PositionGroup, SquadPlayer[]> = {
    GK: [],
    DEF: [],
    MID: [],
    ATT: [],
  };

  for (const player of squad) {
    const group = getPositionGroup(player.player_positions);
    if (group) grouped[group].push(player);
  }

  const weaknesses: SquadWeakness[] = [];

  for (const group of Object.keys(grouped) as PositionGroup[]) {
    const players = grouped[group];
    if (players.length === 0) {
      weaknesses.push({
        group,
        title: GROUP_TITLES[group],
        avgOvr: 0,
        avgAge: 0,
        depth: 0,
        gapToStandard: clubStandardOvr,
        issues: ["No specialist cover in this line"],
        currentPlayers: [],
      });
      continue;
    }

    const sorted = [...players].sort((a, b) => b.overall - a.overall);
    const avgOvr = average(sorted.map((p) => p.overall));
    const ages = sorted.map((p) => p.age).filter((a): a is number => a != null);
    const avgAge = ages.length ? average(ages) : 0;
    const gapToStandard = Math.round((clubStandardOvr - avgOvr) * 10) / 10;

    const issues: string[] = [];
    if (gapToStandard >= 2) {
      issues.push("Below squad standard");
    }
    if (players.length < THIN_DEPTH[group]) {
      issues.push("Thin squad depth");
    }

    const agingLeaders = sorted.filter(
      (p) => (p.age ?? 0) >= AGING_THRESHOLD && p.potential - p.overall <= 4,
    );
    if (agingLeaders.length >= Math.max(1, Math.ceil(sorted.length / 2))) {
      issues.push("Aging profile with limited growth");
    }

    const stagnant = sorted[0] && sorted[0].potential - sorted[0].overall < 3;
    if (stagnant && gapToStandard >= 1) {
      issues.push("Starter nearing peak potential");
    }

    if (issues.length === 0 && gapToStandard < 1) continue;

    weaknesses.push({
      group,
      title: GROUP_TITLES[group],
      avgOvr: Math.round(avgOvr * 10) / 10,
      avgAge: Math.round(avgAge * 10) / 10,
      depth: players.length,
      gapToStandard,
      issues: issues.length ? issues : ["Marginal upgrade room"],
      currentPlayers: sorted.slice(0, 4).map((p) => ({
        short_name: p.short_name,
        overall: p.overall,
        age: p.age,
      })),
    });
  }

  return weaknesses
    .sort((a, b) => b.gapToStandard - a.gapToStandard || a.depth - b.depth)
    .slice(0, MAX_WEAKNESS_GROUPS);
}

export function buildTargetBadges(
  target: TransferTarget,
  groupAvgOvr: number,
  clubStandardOvr: number,
  squadAvgValue: number,
): string[] {
  const badges: string[] = [];
  const ovrUpgrade = target.overall - Math.round(groupAvgOvr);

  if (ovrUpgrade >= 2) {
    badges.push(`+${ovrUpgrade} OVR Upgrade`);
  } else if (ovrUpgrade >= 1) {
    badges.push("+1 OVR Upgrade");
  }

  if (target.potential - target.overall >= 8) {
    badges.push("High Growth Potential");
  } else if (target.potential - target.overall >= 5) {
    badges.push("Solid Growth");
  }

  if ((target.age ?? 99) <= 23) {
    badges.push("Young Talent");
  }

  if (
    target.value_eur != null &&
    squadAvgValue > 0 &&
    target.value_eur <= squadAvgValue * 0.65
  ) {
    badges.push("Budget Friendly");
  } else if (target.value_eur != null && target.value_eur <= 15_000_000) {
    badges.push("Budget Friendly");
  }

  if (target.overall > clubStandardOvr) {
    badges.push("Immediate Starter");
  }

  if (target.sourceClubAvgOvr <= clubStandardOvr - 2) {
    badges.push("Realistic Step-Up");
  }

  return badges.slice(0, 4);
}

function buildPositionSql(group: PositionGroup, paramStart: number) {
  const positions = GROUP_POSITIONS[group];
  const clauses = positions.map((_, i) => `player_positions ILIKE $${paramStart + i}`);
  return {
    sql: `(${clauses.join(" OR ")})`,
    patterns: positions.map((pos) => `%${pos}%`),
  };
}

export async function fetchSquadByClub(clubName: string): Promise<SquadPlayer[]> {
  const result = await pool.query<SquadPlayer>(
    `SELECT
      player_id,
      short_name,
      long_name,
      player_positions,
      overall,
      potential,
      age,
      value_eur,
      wage_eur,
      club_name,
      league_name
    FROM players
    WHERE club_name ILIKE $1
    ORDER BY overall DESC, potential DESC`,
    [clubName],
  );
  return result.rows;
}

export async function fetchTransferTargets(params: {
  clubName: string;
  group: PositionGroup;
  ovrMin: number;
  ovrMax: number;
  clubStandardOvr: number;
  limit?: number;
}): Promise<TransferTarget[]> {
  const { clubName, group, ovrMin, ovrMax, clubStandardOvr } = params;
  const limit = params.limit ?? TARGETS_PER_GROUP;

  const positionFilter = buildPositionSql(group, 5);
  const maxSourceClubOvr = clubStandardOvr + 2;

  const values: unknown[] = [
    clubName,
    ovrMin,
    ovrMax,
    maxSourceClubOvr,
    ...positionFilter.patterns,
    limit,
  ];

  const limitIdx = values.length;

  const result = await pool.query<
    TransferTarget & { source_club_avg_ovr: string }
  >(
    `SELECT
      p.player_id,
      p.short_name,
      p.long_name,
      p.player_positions,
      p.overall,
      p.potential,
      p.age,
      p.club_name,
      p.league_name,
      p.value_eur,
      p.wage_eur,
      c.club_avg_ovr::float AS source_club_avg_ovr
    FROM players p
    INNER JOIN (
      SELECT club_name, AVG(overall) AS club_avg_ovr
      FROM players
      WHERE club_name IS NOT NULL AND club_name <> ''
      GROUP BY club_name
    ) c ON c.club_name = p.club_name
    WHERE p.club_name IS NOT NULL
      AND p.club_name NOT ILIKE $1
      AND p.overall >= $2
      AND p.overall <= $3
      AND p.potential > p.overall
      AND c.club_avg_ovr <= $4
      AND ${positionFilter.sql}
    ORDER BY
      (p.potential - p.overall) DESC,
      p.overall DESC,
      p.age ASC NULLS LAST
    LIMIT $${limitIdx}`,
    values,
  );

  return result.rows.map((row) => {
    const sourceClubAvgOvr = Number(row.source_club_avg_ovr) || 0;
    const growthGap = row.potential - row.overall;
    const base: TransferTarget = {
      player_id: row.player_id,
      short_name: row.short_name,
      long_name: row.long_name,
      player_positions: row.player_positions,
      overall: row.overall,
      potential: row.potential,
      age: row.age,
      club_name: row.club_name,
      league_name: row.league_name,
      value_eur: row.value_eur,
      wage_eur: row.wage_eur,
      sourceClubAvgOvr,
      badges: [],
      ovrUpgrade: 0,
      growthGap,
    };
    return base;
  });
}

export async function generateTransferRecommendations(
  clubName: string,
): Promise<TransferScoutResult | null> {
  const squad = await fetchSquadByClub(clubName);
  if (squad.length === 0) return null;

  const tier = analyzeSquadTier(squad);
  const clubStandardOvr = tier.top11AvgOvr;
  const ovrMin = Math.max(50, Math.floor(clubStandardOvr));
  const ovrMax = Math.min(99, Math.ceil(clubStandardOvr + OVR_RANGE_SPREAD));

  const squadValues = squad
    .map((p) => p.value_eur)
    .filter((v): v is number => v != null && v > 0);
  const squadAvgValue = squadValues.length ? average(squadValues) : 0;

  const weaknesses = identifyWeaknesses(squad, clubStandardOvr);

  const groupsToScout: PositionGroup[] =
    weaknesses.length > 0
      ? weaknesses.map((w) => w.group)
      : (["ATT", "MID", "DEF"] as PositionGroup[]);

  const recommendations: PositionRecommendations[] = [];

  for (const group of groupsToScout) {
    const weakness = weaknesses.find((w) => w.group === group);
    const groupAvgOvr = weakness?.avgOvr ?? clubStandardOvr;

    const rawTargets = await fetchTransferTargets({
      clubName,
      group,
      ovrMin,
      ovrMax,
      clubStandardOvr,
    });

    const targets = rawTargets.map((target) => {
      const ovrUpgrade = target.overall - Math.round(groupAvgOvr);
      const enriched: TransferTarget = {
        ...target,
        ovrUpgrade,
        badges: buildTargetBadges(
          { ...target, ovrUpgrade },
          groupAvgOvr,
          clubStandardOvr,
          squadAvgValue,
        ),
      };
      return enriched;
    });

    if (targets.length > 0) {
      recommendations.push({
        group,
        title: GROUP_TITLES[group],
        targets,
      });
    }
  }

  return {
    clubName,
    squadSize: squad.length,
    tier,
    weaknesses,
    recommendations,
  };
}
