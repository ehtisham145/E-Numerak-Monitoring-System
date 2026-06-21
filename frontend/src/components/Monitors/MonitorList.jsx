import { useMemo, useState } from "react";
import { Search, ServerOff } from "lucide-react";
import clsx from "clsx";
import MonitorCard from "./MonitorCard";
import EmptyState from "../common/EmptyState";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "up", label: "Up" },
  { value: "down", label: "Down" },
  { value: "unknown", label: "Unknown" },
];

export default function MonitorList({ monitors, onEdit, onDelete, onToggle, onAddNew }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    return monitors.filter((m) => {
      const matchesQuery =
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.url.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "all" || m.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [monitors, query, filter]);

  if (monitors.length === 0) {
    return (
      <EmptyState
        icon={ServerOff}
        title="No monitors yet"
        description="Add your first monitor to know the moment a service goes down."
        action={
          <button
            onClick={onAddNew}
            className="rounded-xl bg-vital px-4 py-2.5 text-sm font-semibold text-void transition hover:bg-vital/90"
          >
            Add your first monitor
          </button>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or URL..."
            className="w-full rounded-xl border border-hairline bg-panel py-2.5 pl-9 pr-3 text-sm text-paper placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-wire/40"
          />
        </div>
        <div className="flex gap-1.5 rounded-xl border border-hairline bg-panel p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={clsx(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                filter === f.value
                  ? "bg-raised text-paper"
                  : "text-mist hover:text-paper"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Nothing found" description="Try a different search or filter." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MonitorCard
              key={m.id}
              monitor={m}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
