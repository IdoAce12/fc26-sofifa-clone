"use client";

type FilterState = {
  q: string;
  overallMin: string;
  overallMax: string;
  potentialMin: string;
  potentialMax: string;
  ageMin: string;
  ageMax: string;
  position: string;
  club: string;
};

type PlayerFiltersProps = {
  filters: FilterState;
  clubs: string[];
  positions: string[];
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
};

const inputClass =
  "w-full min-h-[44px] rounded-lg border border-white/10 bg-pitch-800 px-3 py-2.5 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 sm:text-sm";

const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500";

export function PlayerFilters({
  filters,
  clubs,
  positions,
  onChange,
  onReset,
}: PlayerFiltersProps) {
  return (
    <section className="rounded-xl border border-white/5 bg-pitch-800/60 p-4 shadow-card backdrop-blur sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-300">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-zinc-500 transition hover:text-accent-glow"
        >
          Reset all
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="search" className={labelClass}>
          Player name
        </label>
        <input
          id="search"
          type="search"
          placeholder="Search by short name…"
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          className={inputClass}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <div>
          <label htmlFor="overallMin" className={labelClass}>
            OVR min
          </label>
          <input
            id="overallMin"
            type="number"
            min={0}
            max={99}
            placeholder="40"
            value={filters.overallMin}
            onChange={(e) => onChange({ overallMin: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="overallMax" className={labelClass}>
            OVR max
          </label>
          <input
            id="overallMax"
            type="number"
            min={0}
            max={99}
            placeholder="99"
            value={filters.overallMax}
            onChange={(e) => onChange({ overallMax: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="potentialMin" className={labelClass}>
            POT min
          </label>
          <input
            id="potentialMin"
            type="number"
            min={0}
            max={99}
            placeholder="40"
            value={filters.potentialMin}
            onChange={(e) => onChange({ potentialMin: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="potentialMax" className={labelClass}>
            POT max
          </label>
          <input
            id="potentialMax"
            type="number"
            min={0}
            max={99}
            placeholder="99"
            value={filters.potentialMax}
            onChange={(e) => onChange({ potentialMax: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ageMin" className={labelClass}>
            Age min
          </label>
          <input
            id="ageMin"
            type="number"
            min={15}
            max={50}
            placeholder="16"
            value={filters.ageMin}
            onChange={(e) => onChange({ ageMin: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ageMax" className={labelClass}>
            Age max
          </label>
          <input
            id="ageMax"
            type="number"
            min={15}
            max={50}
            placeholder="45"
            value={filters.ageMax}
            onChange={(e) => onChange({ ageMax: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="xs:col-span-1">
          <label htmlFor="position" className={labelClass}>
            Position
          </label>
          <select
            id="position"
            value={filters.position}
            onChange={(e) => onChange({ position: e.target.value })}
            className={inputClass}
          >
            <option value="">All positions</option>
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>
        <div className="xs:col-span-2 sm:col-span-2 lg:col-span-2">
          <label htmlFor="club" className={labelClass}>
            Club
          </label>
          <select
            id="club"
            value={filters.club}
            onChange={(e) => onChange({ club: e.target.value })}
            className={inputClass}
          >
            <option value="">All clubs</option>
            {clubs.map((club) => (
              <option key={club} value={club}>
                {club}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
