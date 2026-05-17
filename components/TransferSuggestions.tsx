"use client";

import Link from "next/link";
import type { TransferScoutResult } from "@/lib/scoutingEngine";
import { formatCurrency } from "@/lib/format";
import { PlayerFaceImage } from "./PlayerFaceImage";
import { RatingBadge } from "./RatingBadge";

type TransferSuggestionsProps = {
  result: TransferScoutResult;
};

type TransferTarget = TransferScoutResult["recommendations"][0]["targets"][0];

const GROUP_ACCENT: Record<string, string> = {
  GK: "border-violet-500/30 bg-violet-500/5",
  DEF: "border-blue-500/30 bg-blue-500/5",
  MID: "border-emerald-500/30 bg-emerald-500/5",
  ATT: "border-amber-500/30 bg-amber-500/5",
};

function InsightBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-glow sm:text-xs">
      {label}
    </span>
  );
}

function TargetCard({ target }: { target: TransferTarget }) {
  return (
    <Link
      href={`/player/${target.player_id}`}
      className="group flex gap-3 rounded-xl border border-white/5 bg-pitch-900/60 p-3 transition hover:border-accent/30 hover:bg-pitch-900"
    >
      <PlayerFaceImage
        playerId={target.player_id}
        name={target.short_name}
        size="lg"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-white group-hover:text-accent-glow">
              {target.short_name}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {target.club_name ?? "Free Agent"}
              {target.league_name ? ` · ${target.league_name}` : ""}
            </p>
            {target.player_positions && (
              <p className="mt-0.5 text-xs text-zinc-600">
                {target.player_positions}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-1.5">
            <RatingBadge value={target.overall} label="Overall" />
            <RatingBadge value={target.potential} label="Potential" />
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {target.badges.map((badge) => (
            <InsightBadge key={badge} label={badge} />
          ))}
        </div>

        <dl className="mt-2 grid grid-cols-3 gap-2 text-xs">
          <div>
            <dt className="text-zinc-600">Age</dt>
            <dd className="font-medium text-zinc-300">{target.age ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-600">Value</dt>
            <dd className="font-medium text-emerald-400/90">
              {formatCurrency(target.value_eur)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-600">Growth</dt>
            <dd className="font-medium text-amber-400/90">
              +{target.growthGap} POT
            </dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

export function TransferSuggestions({ result }: TransferSuggestionsProps) {
  const { tier, weaknesses, recommendations } = result;

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-pitch-800/80 via-pitch-900/90 to-pitch-950 p-5 shadow-card sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent-glow">
          Squad Analysis · {result.clubName}
        </p>
        <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
          Realistic Transfer Market Targets
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Algorithm scoped to OVR {Math.round(tier.top11AvgOvr)}–
          {Math.round(tier.top11AvgOvr) + 5}, high growth profiles (POT &gt; OVR),
          and step-up moves from comparable or lower-tier clubs worldwide.
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-white/5 bg-pitch-950/50 px-3 py-2.5">
            <dt className="text-[10px] uppercase tracking-wider text-zinc-500">
              Top 11 Avg OVR
            </dt>
            <dd className="text-lg font-bold text-emerald-300">
              {tier.top11AvgOvr}
            </dd>
          </div>
          <div className="rounded-lg border border-white/5 bg-pitch-950/50 px-3 py-2.5">
            <dt className="text-[10px] uppercase tracking-wider text-zinc-500">
              Top 11 Avg POT
            </dt>
            <dd className="text-lg font-bold text-amber-300">
              {tier.top11AvgPot}
            </dd>
          </div>
          <div className="rounded-lg border border-white/5 bg-pitch-950/50 px-3 py-2.5">
            <dt className="text-[10px] uppercase tracking-wider text-zinc-500">
              Full Squad Avg
            </dt>
            <dd className="text-lg font-bold text-zinc-200">
              {tier.squadAvgOvr}
            </dd>
          </div>
          <div className="rounded-lg border border-white/5 bg-pitch-950/50 px-3 py-2.5">
            <dt className="text-[10px] uppercase tracking-wider text-zinc-500">
              Squad Size
            </dt>
            <dd className="text-lg font-bold text-zinc-200">
              {result.squadSize}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-white/5 bg-pitch-800/40 p-5 shadow-card">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Squad Weaknesses Identified
        </h3>
        {weaknesses.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">
            No critical positional gaps detected — showing top upgrade paths
            across attack, midfield, and defense.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {weaknesses.map((weakness) => (
              <li
                key={weakness.group}
                className={`rounded-xl border p-4 ${GROUP_ACCENT[weakness.group] ?? "border-white/5 bg-pitch-900/40"}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white">{weakness.title}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Group avg OVR {weakness.avgOvr} · {weakness.depth}{" "}
                      players · gap {weakness.gapToStandard} vs standard
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {weakness.issues.map((issue) => (
                      <span
                        key={issue}
                        className="rounded-md bg-pitch-950/60 px-2 py-0.5 text-[10px] font-medium text-zinc-400 ring-1 ring-white/10"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
                {weakness.currentPlayers.length > 0 && (
                  <p className="mt-2 text-xs text-zinc-600">
                    Current:{" "}
                    {weakness.currentPlayers
                      .map(
                        (p) =>
                          `${p.short_name} (${p.overall}${p.age != null ? `, ${p.age}y` : ""})`,
                      )
                      .join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {recommendations.length === 0 ? (
        <section className="rounded-xl border border-white/5 bg-pitch-800/40 p-8 text-center shadow-card">
          <p className="text-zinc-400">
            No matching targets found for this club tier. Try another club or
            broaden filters in the player database.
          </p>
        </section>
      ) : (
        recommendations.map((section) => (
          <section
            key={section.group}
            className="rounded-xl border border-white/5 bg-pitch-800/40 p-5 shadow-card"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                Recommended Signings
              </h3>
              <span className="text-xs text-zinc-600">{section.title}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {section.targets.map((target) => (
                <TargetCard key={target.player_id} target={target} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

