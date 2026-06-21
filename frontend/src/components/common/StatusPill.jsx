import clsx from "clsx";

const CONFIG = {
  up: { label: "Operational", dot: "bg-vital", text: "text-vital", pulse: true },
  down: { label: "Down", dot: "bg-flatline", text: "text-flatline", pulse: true },
  unknown: { label: "Awaiting check", dot: "bg-mist", text: "text-mist", pulse: false },
};

export default function StatusPill({ status = "unknown", size = "md" }) {
  const cfg = CONFIG[status] || CONFIG.unknown;
  const sizes = {
    sm: "text-[11px] px-2 py-0.5 gap-1.5",
    md: "text-xs px-2.5 py-1 gap-2",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border border-hairline bg-panel font-mono uppercase tracking-wide",
        sizes[size]
      )}
    >
      <span className="relative flex h-2 w-2">
        {cfg.pulse && (
          <span className={clsx("absolute inline-flex h-full w-full rounded-full opacity-60 animate-pulse-dot", cfg.dot)} />
        )}
        <span className={clsx("relative inline-flex h-2 w-2 rounded-full", cfg.dot)} />
      </span>
      <span className={cfg.text}>{cfg.label}</span>
    </span>
  );
}
