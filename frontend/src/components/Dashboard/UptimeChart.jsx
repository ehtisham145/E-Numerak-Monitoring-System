import { useMemo } from "react";

const WIDTH = 600;
const HEIGHT = 56;

function buildSegments(checks) {
  const n = checks.length;
  if (n === 0) return [];
  const segW = WIDTH / n;
  const baseline = HEIGHT / 2;

  return checks.map((c, i) => {
    const x0 = i * segW;
    const isUp = c.status === "success";
    let points;

    if (isUp) {
      const amp = HEIGHT * 0.34;
      points = [
        [x0, baseline],
        [x0 + segW * 0.32, baseline],
        [x0 + segW * 0.45, baseline - amp],
        [x0 + segW * 0.58, baseline + amp * 0.45],
        [x0 + segW * 0.7, baseline],
        [x0 + segW, baseline],
      ];
    } else {
      const dip = HEIGHT * 0.16;
      points = [
        [x0, baseline],
        [x0 + segW * 0.4, baseline],
        [x0 + segW * 0.5, baseline + dip],
        [x0 + segW * 0.6, baseline],
        [x0 + segW, baseline],
      ];
    }

    return { points, isUp, key: c.id ?? `${i}-${c.checked_at}` };
  });
}

export default function UptimeChart({ checks = [], live = false }) {
  const segments = useMemo(() => buildSegments(checks), [checks]);

  if (checks.length === 0) {
    return (
      <div className="flex h-14 items-center justify-center font-mono text-xs text-mist">
        No data yet — waiting for the first check
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg bg-void/40">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="block h-14 w-full"
      >
        <line
          x1="0"
          y1={HEIGHT / 2}
          x2={WIDTH}
          y2={HEIGHT / 2}
          stroke="#232B38"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        {segments.map((seg) => (
          <polyline
            key={seg.key}
            points={seg.points.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke={seg.isUp ? "#34D399" : "#FB5C73"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      {live && (
        <div className="pointer-events-none absolute inset-0 animate-sweep bg-gradient-to-r from-transparent via-paper/[0.04] to-transparent" />
      )}
    </div>
  );
}
