import Link from "next/link";
import type { PlayerRow } from "@/lib/players";
import { PlayerFaceImage } from "./PlayerFaceImage";
import { RatingBadge } from "./RatingBadge";

type PlayersTableProps = {
  players: PlayerRow[];
  loading: boolean;
};

function PlayerRowLink({
  playerId,
  children,
  className = "",
}: {
  playerId: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={`/player/${playerId}`} className={`touch-target ${className}`}>
      {children}
    </Link>
  );
}

function LoadingState() {
  return (
    <div className="rounded-xl border border-white/5 bg-pitch-800/40 p-10 text-center shadow-card sm:p-12">
      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
      <p className="text-sm text-zinc-500">Loading players…</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-white/5 bg-pitch-800/40 p-10 text-center shadow-card sm:p-12">
      <p className="text-zinc-400">No players match your filters.</p>
      <p className="mt-1 text-sm text-zinc-600">Try adjusting search or filter criteria.</p>
    </div>
  );
}

function MobilePlayerCard({ player }: { player: PlayerRow }) {
  return (
    <PlayerRowLink
      playerId={player.player_id}
      className="flex items-center gap-3 rounded-xl border border-white/5 bg-pitch-900/50 p-3 active:bg-white/[0.06]"
    >
      <PlayerFaceImage
        playerId={player.player_id}
        name={player.short_name}
        size="lg"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-white">{player.short_name}</p>
        <p className="truncate text-xs text-zinc-500">
          {player.club_name ?? "Free Agent"}
          {player.age != null ? ` · ${player.age} yrs` : ""}
        </p>
        {player.player_positions && (
          <p className="mt-0.5 truncate text-xs text-zinc-600">
            {player.player_positions}
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <RatingBadge value={player.overall} label="Overall" />
        <RatingBadge value={player.potential} label="Potential" />
      </div>
    </PlayerRowLink>
  );
}

export function PlayersTable({ players, loading }: PlayersTableProps) {
  if (loading) return <LoadingState />;
  if (players.length === 0) return <EmptyState />;

  return (
    <>
      {/* Mobile: native-style card list */}
      <div className="space-y-2 md:hidden">
        {players.map((player) => (
          <MobilePlayerCard key={player.player_id} player={player} />
        ))}
      </div>

      {/* Desktop / tablet: table */}
      <div className="hidden overflow-hidden rounded-xl border border-white/5 bg-pitch-800/40 shadow-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-pitch-900/80 text-xs uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-3 font-medium">Player</th>
                <th className="px-4 py-3 font-medium">Age</th>
                <th className="px-4 py-3 font-medium">Club</th>
                <th className="px-4 py-3 text-center font-medium">OVR</th>
                <th className="px-4 py-3 text-center font-medium">POT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {players.map((player) => (
                <tr
                  key={player.player_id}
                  className="group transition hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3">
                    <PlayerRowLink
                      playerId={player.player_id}
                      className="flex items-center gap-3 !min-h-0"
                    >
                      <PlayerFaceImage
                        playerId={player.player_id}
                        name={player.short_name}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white group-hover:text-accent-glow">
                          {player.short_name}
                        </p>
                        {player.long_name &&
                          player.long_name !== player.short_name && (
                            <p className="truncate text-xs text-zinc-500">
                              {player.long_name}
                            </p>
                          )}
                        {player.player_positions && (
                          <p className="mt-0.5 text-xs text-zinc-600">
                            {player.player_positions}
                          </p>
                        )}
                      </div>
                    </PlayerRowLink>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-300">
                    <PlayerRowLink
                      playerId={player.player_id}
                      className="block py-1 !min-h-0 text-zinc-300 hover:text-white"
                    >
                      {player.age ?? "—"}
                    </PlayerRowLink>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3">
                    <PlayerRowLink
                      playerId={player.player_id}
                      className="block truncate !min-h-0 text-zinc-400 hover:text-white"
                    >
                      {player.club_name ?? "Free Agent"}
                    </PlayerRowLink>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <PlayerRowLink
                      playerId={player.player_id}
                      className="inline-block !min-h-0"
                    >
                      <RatingBadge value={player.overall} label="Overall" />
                    </PlayerRowLink>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <PlayerRowLink
                      playerId={player.player_id}
                      className="inline-block !min-h-0"
                    >
                      <RatingBadge value={player.potential} label="Potential" />
                    </PlayerRowLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

