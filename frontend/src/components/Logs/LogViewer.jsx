import { useMemo, useState } from "react";
import { TerminalSquare } from "lucide-react";
import clsx from "clsx";
import EmptyState from "../common/EmptyState";
import { formatTime } from "../../utils/format";

const STATUS_STYLE = {
  success: "text-vital",
  failure: "text-flatline",
  timeout: "text-amber",
};

export default function LogViewer({ logs }) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(
    () => (filter === "all" ? logs : logs.filter((l) => l.status === filter)),
    [logs, filter]
  );

  if (logs.length === 0) {
    return (
      <EmptyState
        icon={TerminalSquare}
        title="No logs available"
        description="Records will appear here once the first health check is completed."
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex gap-1.5 rounded-xl border border-hairline bg-panel p-1 w-fit">
        {["all", "success", "failure", "timeout"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={clsx(
              "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition",
              filter === s ? "bg-raised text-paper" : "text-mist hover:text-paper"
            )}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-hairline bg-panel">
        <table className="w-full font-mono text-xs">
          <thead>
            <tr className="border-b border-hairline text-left text-mist">
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Monitor</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Latency</th>
              <th className="px-4 py-3 font-medium">Error</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-hairline/60 last:border-0 hover:bg-raised/40">
                <td className="whitespace-nowrap px-4 py-2.5 text-mist">{formatTime(log.checked_at)}</td>
                <td className="px-4 py-2.5 text-paper">{log.monitor_name}</td>
                <td className={clsx("px-4 py-2.5 font-medium", STATUS_STYLE[log.status])}>
                  {log.status}
                </td>
                <td className="px-4 py-2.5 text-mist">{log.status_code ?? "—"}</td>
                <td className="px-4 py-2.5 text-mist">
                  {log.response_time_ms ? `${Math.round(log.response_time_ms)}ms` : "—"}
                </td>
                <td className="max-w-[280px] truncate px-4 py-2.5 text-flatline/90">
                  {log.error_message || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}