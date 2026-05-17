import type { PlayerDetail } from "@/lib/players";
import { PlayerFaceImage } from "./PlayerFaceImage";
import {
  formatCurrency,
  formatStars,
  parseBadgeList,
} from "@/lib/format";
import { BackLink } from "./BackLink";
import { RatingBadge } from "./RatingBadge";
import { StatCircle } from "./StatCircle";
import { TraitBadge } from "./TraitBadge";

const MAIN_STATS = [
  { key: "pace" as const, label: "Pace", color: "text-lime-400", ring: "ring-lime-500/50" },
  { key: "shooting" as const, label: "Shooting", color: "text-red-400", ring: "ring-red-500/50" },
  { key: "passing" as const, label: "Passing", color: "text-sky-400", ring: "ring-sky-500/50" },
  {
    key: "dribbling" as const,
    label: "Dribbling",
    color: "text-fuchsia-400",
    ring: "ring-fuchsia-500/50",
  },
  {
    key: "defending" as const,
    label: "Defending",
    color: "text-blue-400",
    ring: "ring-blue-500/50",
  },
  { key: "physic" as const, label: "Physic", color: "text-orange-400", ring: "ring-orange-500/50" },
];

type PlayerProfileProps = {
  player: PlayerDetail;
};

export function PlayerProfile({ player }: PlayerProfileProps) {
  const traits = parseBadgeList(player.player_traits);
  const tags = parseBadgeList(player.player_tags);
  const displayName = player.long_name ?? player.short_name;

  return (
    <div className="min-h-screen bg-pitch-950">
      <div className="border-b border-white/5 bg-pitch-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <BackLink />
        </div>
      </div>

      <main className="mx-auto max-w-5xl space-y-4 px-3 py-4 pb-10 sm:space-y-6 sm:px-6 sm:py-6 lg:py-8">
        <section className="overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-pitch-800/80 via-pitch-900/90 to-pitch-950 shadow-card shadow-glow">
          <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-8">
            <div className="flex justify-center sm:justify-start">
              <PlayerFaceImage
                playerId={player.player_id}
                name={displayName}
                size="xl"
                priority
              />
            </div>

            <div className="flex flex-col justify-center text-center sm:text-left">
              <p className="text-sm font-medium uppercase tracking-widest text-accent-glow">
                {player.player_positions ?? "Player"}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {displayName}
              </h1>
              {player.short_name !== displayName && (
                <p className="mt-0.5 text-zinc-500">{player.short_name}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <RatingBadge value={player.overall} label="Overall" />
                <RatingBadge value={player.potential} label="Potential" />
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-zinc-500">Club</dt>
                  <dd className="font-medium text-zinc-200">
                    {player.club_name ?? "Free Agent"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">League</dt>
                  <dd className="font-medium text-zinc-200">
                    {player.league_name ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Nationality</dt>
                  <dd className="font-medium text-zinc-200">
                    {player.nationality_name ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Age</dt>
                  <dd className="font-medium text-zinc-200">
                    {player.age ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Height</dt>
                  <dd className="font-medium text-zinc-200">
                    {player.height_cm ? `${player.height_cm} cm` : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Weight</dt>
                  <dd className="font-medium text-zinc-200">
                    {player.weight_kg ? `${player.weight_kg} kg` : "—"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500/80">
              Market Value
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-300">
              {formatCurrency(player.value_eur)}
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-500/80">
              Weekly Wage
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-300">
              {formatCurrency(player.wage_eur)}
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-white/5 bg-pitch-800/40 p-6 shadow-card">
          <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Core Attributes
          </h2>
          <div className="grid grid-cols-3 gap-6 sm:grid-cols-6 sm:gap-4">
            {MAIN_STATS.map(({ key, label, color, ring }) => (
              <StatCircle
                key={key}
                label={label}
                value={player[key]}
                colorClass={color}
                ringClass={ring}
              />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-white/5 bg-pitch-800/40 p-6 shadow-card">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            General
          </h2>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-pitch-900/60 px-4 py-3">
              <dt className="text-xs text-zinc-500">Preferred Foot</dt>
              <dd className="mt-1 font-semibold text-white">
                {player.preferred_foot ?? "—"}
              </dd>
            </div>
            <div className="rounded-lg bg-pitch-900/60 px-4 py-3">
              <dt className="text-xs text-zinc-500">Weak Foot</dt>
              <dd className="mt-1 text-lg tracking-widest text-amber-400">
                {player.weak_foot != null
                  ? `${formatStars(player.weak_foot)} (${player.weak_foot}★)`
                  : "—"}
              </dd>
            </div>
            <div className="rounded-lg bg-pitch-900/60 px-4 py-3">
              <dt className="text-xs text-zinc-500">Skill Moves</dt>
              <dd className="mt-1 text-lg tracking-widest text-amber-400">
                {player.skill_moves != null
                  ? `${formatStars(player.skill_moves)} (${player.skill_moves}★)`
                  : "—"}
              </dd>
            </div>
          </dl>
        </section>

        {traits.length > 0 && (
          <section className="rounded-xl border border-white/5 bg-pitch-800/40 p-6 shadow-card">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
              PlayStyles+
            </h2>
            <div className="flex flex-wrap gap-2">
              {traits.map((trait) => (
                <TraitBadge key={trait} label={trait} variant="trait" />
              ))}
            </div>
          </section>
        )}

        {tags.length > 0 && (
          <section className="rounded-xl border border-white/5 bg-pitch-800/40 p-6 shadow-card">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Special Traits
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <TraitBadge key={tag} label={tag} variant="tag" />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
