export function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`);
  const diffMs = Date.now() - date.getTime();
  const sec = Math.floor(diffMs / 1000);

if (sec < 5) return "just now";
if (sec < 60) return `${sec}s ago`;
const min = Math.floor(sec / 60);
if (min < 60) return `${min}m ago`;
const hr = Math.floor(min / 60);
if (hr < 24) return `${hr}h ago`;
const days = Math.floor(hr / 24);
return `${days}d ago`;

}
export function formatTime(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function truncate(str, n = 42) {
  if (!str) return "";
  return str.length > n ? `${str.slice(0, n - 1)}…` : str;
}
