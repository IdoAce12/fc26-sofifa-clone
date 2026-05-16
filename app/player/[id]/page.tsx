export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { PlayerProfile } from "@/components/PlayerProfile";
import { getPlayerById } from "@/lib/players";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const playerId = Number.parseInt(id, 10);
  if (!Number.isFinite(playerId)) {
    return { title: "Player Not Found | FC26 Scout" };
  }
  const player = await getPlayerById(playerId);
  if (!player) {
    return { title: "Player Not Found | FC26 Scout" };
  }
  return {
    title: `${player.long_name ?? player.short_name} | FC26 Scout`,
    description: `View ${player.short_name}'s FC26 stats, PlayStyles, and attributes.`,
  };
}

export default async function PlayerPage({ params }: PageProps) {
  const { id } = await params;
  const playerId = Number.parseInt(id, 10);

  if (!Number.isFinite(playerId)) {
    notFound();
  }

  const player = await getPlayerById(playerId);
  if (!player) {
    notFound();
  }

  return <PlayerProfile player={player} />;
}