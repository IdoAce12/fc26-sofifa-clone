"use client";

import { useCallback, useEffect, useState } from "react";
import type { PlayerRow, PlayersResult } from "@/lib/players";
import { useDebounce } from "@/lib/useDebounce";
import { Header } from "./Header";
import { Pagination } from "./Pagination";
import { PlayerFilters } from "./PlayerFilters";
import { PlayersTable } from "./PlayersTable";
import { TransferScoutPanel } from "./TransferScoutPanel";

type DashboardTab = "database" | "transfers";

const EMPTY_FILTERS = {
  q: "",
  overallMin: "",
  overallMax: "",
  potentialMin: "",
  potentialMax: "",
  ageMin: "",
  ageMax: "",
  position: "",
  club: "",
};

function buildQuery(
  filters: typeof EMPTY_FILTERS,
  page: number,
  debouncedQ: string,
) {
  const params = new URLSearchParams();
  if (debouncedQ) params.set("q", debouncedQ);
  if (filters.overallMin) params.set("overallMin", filters.overallMin);
  if (filters.overallMax) params.set("overallMax", filters.overallMax);
  if (filters.potentialMin) params.set("potentialMin", filters.potentialMin);
  if (filters.potentialMax) params.set("potentialMax", filters.potentialMax);
  if (filters.ageMin) params.set("ageMin", filters.ageMin);
  if (filters.ageMax) params.set("ageMax", filters.ageMax);
  if (filters.position) params.set("position", filters.position);
  if (filters.club) params.set("club", filters.club);
  params.set("page", String(page));
  params.set("limit", "25");
  return params.toString();
}

export function PlayerScout() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("database");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);

  const debouncedQ = useDebounce(filters.q, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  useEffect(() => {
    fetch("/api/filters")
      .then((r) => r.json())
      .then((data) => {
        setClubs(data.clubs ?? []);
        setPositions(data.positions ?? []);
      })
      .catch(console.error);
  }, []);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildQuery(filters, page, debouncedQ);
      const res = await fetch(`/api/players?${qs}`);
      if (!res.ok) throw new Error("Fetch failed");
      const data: PlayersResult = await res.json();
      setPlayers(data.players);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      setPlayers([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [filters, page, debouncedQ]);

  useEffect(() => {
    if (activeTab === "database") {
      fetchPlayers();
    }
  }, [fetchPlayers, activeTab]);

  const handleFilterChange = (patch: Partial<typeof EMPTY_FILTERS>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-pitch-950">
      <Header />
      <main className="mx-auto max-w-7xl space-y-4 px-3 py-4 pb-8 sm:space-y-5 sm:px-6 sm:py-6 lg:px-8">
        <div
          className="flex gap-1 rounded-xl border border-white/5 bg-pitch-900/80 p-1 shadow-card"
          role="tablist"
          aria-label="Scout dashboard"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "database"}
            onClick={() => setActiveTab("database")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === "database"
                ? "bg-accent text-pitch-950 shadow-sm"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            }`}
          >
            Player Database
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "transfers"}
            onClick={() => setActiveTab("transfers")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === "transfers"
                ? "bg-accent text-pitch-950 shadow-sm"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            }`}
          >
            Realistic Transfer Recommendations
          </button>
        </div>

        {activeTab === "database" ? (
          <>
            <PlayerFilters
              filters={filters}
              clubs={clubs}
              positions={positions}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
            <PlayersTable players={players} loading={loading} />
            {!loading && (
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                limit={25}
                onPageChange={setPage}
              />
            )}
          </>
        ) : (
          <TransferScoutPanel clubs={clubs} />
        )}
      </main>
    </div>
  );
}
