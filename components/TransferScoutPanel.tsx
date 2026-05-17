"use client";

import { useState } from "react";
import type { TransferScoutResult } from "@/lib/scoutingEngine";
import { TransferSuggestions } from "./TransferSuggestions";

const inputClass =
  "w-full min-h-[44px] rounded-lg border border-white/10 bg-pitch-800 px-3 py-2.5 text-base text-zinc-100 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 sm:text-sm";

const labelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500";

type TransferScoutPanelProps = {
  clubs: string[];
};

export function TransferScoutPanel({ clubs }: TransferScoutPanelProps) {
  const [selectedClub, setSelectedClub] = useState("");
  const [result, setResult] = useState<TransferScoutResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSquad = async () => {
    if (!selectedClub.trim()) {
      setError("Select a club to analyze their squad.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `/api/transfers?club=${encodeURIComponent(selectedClub)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Analysis failed");
      }

      setResult(data as TransferScoutResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-white/5 bg-pitch-800/60 p-4 shadow-card backdrop-blur sm:p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-zinc-300">
            Realistic Transfer Recommendations
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Select your club to scan squad weaknesses and surface global
            targets that fit your tier, growth profile, and budget context.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="transfer-club" className={labelClass}>
              Your Club
            </label>
            <select
              id="transfer-club"
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className={inputClass}
            >
              <option value="">Choose a club…</option>
              {clubs.map((club) => (
                <option key={club} value={club}>
                  {club}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={analyzeSquad}
            disabled={loading || !selectedClub}
            className="min-h-[44px] shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-pitch-950 transition hover:bg-accent-glow disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing Squad…" : "Generate Recommendations"}
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-white/5 bg-pitch-800/40 p-12 text-center shadow-card">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
          <p className="text-sm text-zinc-500">
            Running squad analysis and scouting global targets…
          </p>
        </div>
      )}

      {result && !loading && <TransferSuggestions result={result} />}
    </div>
  );
}
