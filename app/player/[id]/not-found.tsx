import Link from "next/link";
import { BackLink } from "@/components/BackLink";

export default function PlayerNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-pitch-950 px-4">
      <div className="mb-6">
        <BackLink />
      </div>
      <h1 className="text-2xl font-bold text-white">Player not found</h1>
      <p className="mt-2 text-zinc-500">
        This player ID does not exist in the database.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-pitch-950 transition hover:bg-accent-glow"
      >
        Return to search
      </Link>
    </div>
  );
}
