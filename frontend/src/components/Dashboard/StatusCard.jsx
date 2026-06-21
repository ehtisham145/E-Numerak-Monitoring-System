import clsx from "clsx";

export default function StatusCard({ label, value, icon: Icon, tone = "default", hint }) {
  const tones = {
    default: "text-paper",
    vital: "text-vital",
    flatline: "text-flatline",
    amber: "text-amber",
  };

  return (
    <div className="rounded-2xl border border-hairline bg-panel px-5 py-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-mist">{label}</span>
        {Icon && <Icon size={16} className="text-mist" />}
      </div>
      <p className={clsx("mt-3 font-mono text-3xl font-semibold leading-none", tones[tone])}>
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-mist">{hint}</p>}
    </div>
  );
}
