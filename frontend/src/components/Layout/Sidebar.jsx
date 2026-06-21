import { NavLink } from "react-router-dom";
import { Activity, Server, Bell, Terminal, Settings, HeartPulse } from "lucide-react";
import clsx from "clsx";

const NAV = [
  { to: "/", label: "Dashboard", icon: Activity },
  { to: "/monitors", label: "Monitors", icon: Server },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/logs", label: "Logs", icon: Terminal },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <>
      <aside className="hidden w-60 flex-shrink-0 border-r border-hairline bg-panel/60 md:flex md:flex-col">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-vital/10 text-vital">
            <HeartPulse size={20} />
          </div>
          <div>
            <p className="font-display text-sm font-semibold leading-none text-paper">E-numerak</p>
            <p className="font-mono text-[11px] leading-none text-mist mt-1">vitals</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                clsx(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-raised text-paper"
                    : "text-mist hover:bg-raised/60 hover:text-paper"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={clsx(
                      "h-5 w-[3px] rounded-full transition-colors",
                      isActive ? "bg-vital" : "bg-transparent"
                    )}
                  />
                  <Icon size={17} strokeWidth={2} />
                  <span className="font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-6 py-5">
          <p className="font-mono text-[11px] text-mist">
            checking every <span className="text-paper">60s</span>
          </p>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-hairline bg-panel/95 backdrop-blur md:hidden">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              clsx(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px]",
                isActive ? "text-vital" : "text-mist"
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
