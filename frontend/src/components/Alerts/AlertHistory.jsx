import { useMemo, useState } from "react";
import { BellOff, CheckCircle2, XCircle, Clock3 } from "lucide-react";
import clsx from "clsx";
import EmptyState from "../common/EmptyState";
import { formatTime } from "../../utils/format";

const TYPE_DOT = {
  down: "bg-flatline",
  up: "bg-vital",
  slow: "bg-amber",
  error: "bg-amber",
};

const TYPE_LABEL = {
  down: "Server down",
  up: "Server restored",
  slow: "Slow response",
  error: "Error",
};

export default function AlertHistory({ alerts }) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(
    () => (filter === "all" ? alerts : alerts.filter((a) => a.alert_type === filter)),
    [alerts, filter]
  );

  if (alerts.length === 0) {
    return (
      <EmptyState
        icon={BellOff}
        title="No alerts found"
        description="When a monitor goes down or recovers, its record will appear here."
      />
    );
  }

  return (
    <div>
      <div className="mb-5 flex gap-1.5 rounded-xl border border-hairline bg-panel p-1 w-fit">
        {["all", "down", "up", "slow", "error"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={clsx(
              "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition",
              filter === t ? "bg-raised text-paper" : "text-mist hover:text-paper"
            )}
          >
            {t === "all" ? "All" : TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No alerts match this filter" />
      ) : (
        <ol className="relative border-l border-hairline pl-6">
          {filtered.map((alert) => (
            <li key={alert.id} className="mb-6 last:mb-0">
              <span
                className={clsx(
                  "absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-void",
                  TYPE_DOT[alert.alert_type] || "bg-mist"
                )}
              />
              <div className="rounded-2xl border border-hairline bg-panel px-4 py-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-paper">
                    {TYPE_LABEL[alert.alert_type] || alert.alert_type} · {alert.monitor_name}
                  </p>
                  <span className="font-mono text-[11px] text-mist">
                    {formatTime(alert.created_at)}
                  </span>
                </div>
                <p className="mt-1.5 whitespace-pre-line text-xs text-mist line-clamp-3">
                  {alert.message}
                </p>
                <div className="mt-2.5 flex items-center gap-4 font-mono text-[11px] text-mist">
                  <span>{alert.whatsapp_number}</span>
                  <span
                    className={clsx(
                      "flex items-center gap-1",
                      alert.status === "sent" ? "text-vital" : "text-flatline"
                    )}
                  >
                    {alert.status === "sent" ? (
                      <CheckCircle2 size={12} />
                    ) : alert.status === "pending" ? (
                      <Clock3 size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {alert.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}