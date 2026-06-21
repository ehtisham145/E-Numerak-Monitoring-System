import { useEffect, useMemo, useState } from "react";
import { Activity, Server, AlertTriangle, BellRing, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Topbar from "../components/Layout/Topbar";
import StatusCard from "../components/Dashboard/StatusCard";
import UptimeChart from "../components/Dashboard/UptimeChart";
import ResponseTime from "../components/Dashboard/ResponseTime";
import StatusPill from "../components/common/StatusPill";
import EmptyState from "../components/common/EmptyState";
import { getDashboardStats, getMonitors, getLogs, getAlerts } from "../services/api";

const POLL_MS = 20000;

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [monitors, setMonitors] = useState([]);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [s, m, l, a] = await Promise.all([
          getDashboardStats(),
          getMonitors(),
          getLogs(),
          getAlerts(),
        ]);
        if (!alive) return;
        setStats(s);
        setMonitors(m);
        setLogs(l);
        setAlerts(a);
        setError("");
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const logsByMonitor = useMemo(() => {
    const map = {};
    monitors.forEach((m) => (map[m.id] = []));
    logs.forEach((l) => {
      if (!map[l.monitor_id]) map[l.monitor_id] = [];
      map[l.monitor_id].push(l);
    });
    Object.keys(map).forEach((id) => {
      map[id] = map[id].slice().reverse().slice(-20);
    });
    return map;
  }, [monitors, logs]);

  const responseTimeMonitor = useMemo(() => {
    if (monitors.length === 0) return null;
    return [...monitors].sort(
      (a, b) => (logsByMonitor[b.id]?.length || 0) - (logsByMonitor[a.id]?.length || 0)
    )[0];
  }, [monitors, logsByMonitor]);

  const responseTimeData = useMemo(() => {
    if (!responseTimeMonitor) return [];
    return (logsByMonitor[responseTimeMonitor.id] || []).map((l) => ({
      time: new Date(l.checked_at.endsWith("Z") ? l.checked_at : `${l.checked_at}Z`).toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      ),
      ms: l.response_time_ms || 0,
    }));
  }, [responseTimeMonitor, logsByMonitor]);

  return (
    <div>
      <Topbar title="Dashboard" subtitle="Real-time pulse of your services" />

      <div className="px-6 py-6 md:px-8">
        {error && (
          <div className="mb-5 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
            {error}
          </div>
        )}

        {!loading && monitors.length === 0 ? (
          <EmptyState
            icon={Server}
            title="No monitors found"
            description="Add your first monitor to start tracking your service performance."
            action={
              <Link
                to="/monitors"
                className="inline-flex items-center gap-1.5 rounded-xl bg-vital px-4 py-2.5 text-sm font-semibold text-void transition hover:bg-vital/90"
              >
                Go to Monitors <ArrowUpRight size={14} />
              </Link>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatusCard label="Total Monitors" value={stats?.total_monitors ?? "—"} icon={Server} />
              <StatusCard label="Up" value={stats?.up_monitors ?? "—"} icon={Activity} tone="vital" />
              <StatusCard label="Down" value={stats?.down_monitors ?? "—"} icon={AlertTriangle} tone="flatline" />
              <StatusCard label="Total Alerts" value={stats?.total_alerts ?? "—"} icon={BellRing} tone="amber" />
            </div>

            <div className="mt-6 rounded-2xl border border-hairline bg-panel p-5">
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="font-display text-sm font-semibold text-paper">Live pulse</h2>
                <span className="font-mono text-[11px] text-mist">Recent checks; each row represents a service</span>
              </div>
              <div className="space-y-4">
                {monitors.map((m) => (
                  <div key={m.id} className="flex items-center gap-4">
                    <div className="w-36 flex-shrink-0">
                      <p className="truncate text-sm font-medium text-paper">{m.name}</p>
                      <div className="mt-1">
                        <StatusPill status={m.status} size="sm" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <UptimeChart checks={logsByMonitor[m.id] || []} live />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-hairline bg-panel p-5 lg:col-span-2">
                <div className="mb-1 flex items-baseline justify-between">
                  <h2 className="font-display text-sm font-semibold text-paper">Response time</h2>
                  {responseTimeMonitor && (
                    <span className="font-mono text-[11px] text-mist">{responseTimeMonitor.name}</span>
                  )}
                </div>
                <ResponseTime data={responseTimeData} color="#5B8DEF" />
              </div>

              <div className="rounded-2xl border border-hairline bg-panel p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-sm font-semibold text-paper">Recent alerts</h2>
                  <Link to="/alerts" className="text-xs text-wire hover:underline">
                    View all
                  </Link>
                </div>
                {alerts.length === 0 ? (
                  <p className="text-xs text-mist">No alerts recorded yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {alerts.slice(0, 4).map((a) => (
                      <li key={a.id} className="flex items-start gap-2.5 text-xs">
                        <span
                          className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                            a.alert_type === "down" ? "bg-flatline" : "bg-vital"
                          }`}
                        />
                        <div>
                          <p className="text-paper">{a.monitor_name}</p>
                          <p className="text-mist">
                            {a.alert_type === "down" ? "Server is down" : "Service recovered"}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}