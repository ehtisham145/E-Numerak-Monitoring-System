import { Globe, Pencil, Trash2, Power, Clock, Zap } from "lucide-react";
import clsx from "clsx";
import StatusPill from "../common/StatusPill";
import { timeAgo, truncate } from "../../utils/format";

export default function MonitorCard({ monitor, onEdit, onDelete, onToggle }) {
  const isDown = monitor.status === "down";

  return (
    <div
      className={clsx(
        "group rounded-2xl border bg-panel p-5 transition-colors",
        isDown ? "border-flatline/30" : "border-hairline"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-sm font-semibold text-paper">
              {monitor.name}
            </h3>
            {!monitor.is_active && (
              <span className="rounded-full bg-raised px-2 py-0.5 font-mono text-[10px] uppercase text-mist">
                Paused
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-mist">
            <Globe size={12} />
            <span className="truncate font-mono">{truncate(monitor.url, 38)}</span>
          </div>
        </div>
        <StatusPill status={monitor.status} size="sm" />
      </div>

      <div className="mt-4 flex items-center gap-5 font-mono text-xs text-mist">
        <span className="flex items-center gap-1.5">
          <Zap size={12} />
          {monitor.response_time_ms ? `${Math.round(monitor.response_time_ms)}ms` : "—"}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={12} />
          {timeAgo(monitor.last_checked_at)}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-hairline pt-3 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <button
          onClick={() => onToggle(monitor)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-mist transition hover:bg-raised hover:text-paper"
        >
          <Power size={13} />
          {monitor.is_active ? "Pause" : "Resume"}
        </button>
        <button
          onClick={() => onEdit(monitor)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-mist transition hover:bg-raised hover:text-paper"
        >
          <Pencil size={13} />
          Edit
        </button>
        <button
          onClick={() => onDelete(monitor)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-mist transition hover:bg-flatline/10 hover:text-flatline"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
}