import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { getDashboardStats } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import clsx from "clsx";

export default function Topbar({ title, subtitle }) {
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const data = await getDashboardStats();
        if (alive) {
          setStats(data);
          setErrored(false);
        }
      } catch {
        if (alive) setErrored(true);
      }
    };
    poll();
    const id = setInterval(poll, 20000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const down = stats?.down_monitors ?? 0;
  const allUp = stats && down === 0;

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline px-6 py-5 md:px-8">
      <div>
        <h1 className="font-display text-xl font-semibold text-paper">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-mist">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 font-mono text-xs",
            errored
              ? "border-amber/30 bg-amber/10 text-amber"
              : allUp
              ? "border-vital/30 bg-vital/10 text-vital"
              : "border-flatline/30 bg-flatline/10 text-flatline"
          )}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={clsx(
                "absolute inline-flex h-full w-full rounded-full opacity-60 animate-pulse-dot",
                errored ? "bg-amber" : allUp ? "bg-vital" : "bg-flatline"
              )}
            />
            <span
              className={clsx(
                "relative inline-flex h-2 w-2 rounded-full",
                errored ? "bg-amber" : allUp ? "bg-vital" : "bg-flatline"
              )}
            />
          </span>
          {errored
            ? "Can't connect to backend"
            : !stats
            ? "Checking..."
            : allUp
            ? "All systems operational"
            : `${down} monitor${down > 1 ? "s" : ""} down`}
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-xs text-mist transition hover:bg-raised hover:text-paper"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </header>
  );
}
