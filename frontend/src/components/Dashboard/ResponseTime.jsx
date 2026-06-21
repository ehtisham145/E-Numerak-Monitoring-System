import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from "recharts";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { ms, time } = payload[0].payload;
  return (
    <div className="rounded-lg border border-hairline bg-raised px-3 py-2 font-mono text-xs text-paper shadow-xl">
      <p className="text-mist">{time}</p>
      <p className="mt-0.5 font-medium">{Math.round(ms)}ms</p>
    </div>
  );
}

export default function ResponseTime({ data = [], color = "#5B8DEF" }) {
  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center font-mono text-xs text-mist">
        No response time data yet
      </div>
    );
  }

  const gradientId = `rt-${color.replace("#", "")}`;

  return (
    <ResponsiveContainer width="100%" height={128}>
      <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#232B38" }} />
        <Area
          type="monotone"
          dataKey="ms"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
