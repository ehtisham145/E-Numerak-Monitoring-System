import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { getDefaultNumbers } from "../Alerts/AlertSettings";

const TYPES = [
  { value: "http", label: "HTTP / Website" },
  { value: "api", label: "API endpoint" },
  { value: "invoice", label: "Invoice system" },
];

function NumberChips({ numbers, setNumbers }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const cleaned = draft.replace(/\D/g, "");
    if (cleaned && !numbers.includes(cleaned)) {
      setNumbers([...numbers, cleaned]);
    }
    setDraft("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-xl border border-hairline bg-void/40 p-2.5">
        {numbers.map((n) => (
          <span
            key={n}
            className="flex items-center gap-1.5 rounded-full bg-raised px-3 py-1 font-mono text-xs text-paper"
          >
            {n}
            <button
              type="button"
              onClick={() => setNumbers(numbers.filter((x) => x !== n))}
              className="text-mist hover:text-flatline"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          onBlur={add}
          placeholder={numbers.length ? "Add another..." : "923xxxxxxxxx"}
          className="min-w-[120px] flex-1 bg-transparent py-1 font-mono text-xs text-paper placeholder:text-mist focus:outline-none"
        />
      </div>
      <p className="mt-1.5 text-xs text-mist">
        Press Enter or comma to add a number. Please include the country code (e.g., 923271141797).
      </p>
    </div>
  );
}

export default function MonitorForm({ initial, onSubmit, onCancel, submitting }) {
  const [name, setName] = useState(initial?.name || "");
  const [url, setUrl] = useState(initial?.url || "");
  const [monitorType, setMonitorType] = useState(initial?.monitor_type || "http");
  const [expectedStatus, setExpectedStatus] = useState(initial?.expected_status_code ?? 200);
  const [alertOnDown, setAlertOnDown] = useState(initial?.alert_on_down ?? true);
  const [numbers, setNumbers] = useState(
    initial?.alert_whatsapp_numbers
      ? initial.alert_whatsapp_numbers.split(",").map((s) => s.trim()).filter(Boolean)
      : getDefaultNumbers()
  );
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      setError("Both Name and URL are required fields.");
      return;
    }
    try {
      new URL(url);
    } catch {
      setError("Invalid URL format. Please ensure it starts with https://");
      return;
    }
    setError("");
    onSubmit({
      name: name.trim(),
      url: url.trim(),
      monitor_type: monitorType,
      expected_status_code: Number(expectedStatus) || 200,
      alert_on_down: alertOnDown,
      alert_whatsapp_numbers: numbers.join(","),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-mist">Monitor name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Invoice API"
          className="w-full rounded-xl border border-hairline bg-void/40 px-3.5 py-2.5 text-sm text-paper placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-wire/40"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-mist">URL</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourserver.com/api/health"
          className="w-full rounded-xl border border-hairline bg-void/40 px-3.5 py-2.5 font-mono text-sm text-paper placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-wire/40"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist">Type</label>
          <select
            value={monitorType}
            onChange={(e) => setMonitorType(e.target.value)}
            className="w-full rounded-xl border border-hairline bg-void/40 px-3.5 py-2.5 text-sm text-paper focus:outline-none focus:ring-2 focus:ring-wire/40"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist">Expected status code</label>
          <input
            type="number"
            value={expectedStatus}
            onChange={(e) => setExpectedStatus(e.target.value)}
            className="w-full rounded-xl border border-hairline bg-void/40 px-3.5 py-2.5 font-mono text-sm text-paper focus:outline-none focus:ring-2 focus:ring-wire/40"
          />
        </div>
      </div>

      <label className="flex items-center justify-between rounded-xl border border-hairline bg-void/40 px-3.5 py-3">
        <span className="text-sm text-paper">Send WhatsApp alerts when status is down</span>
        <input
          type="checkbox"
          checked={alertOnDown}
          onChange={(e) => setAlertOnDown(e.target.checked)}
          className="h-4 w-4 accent-vital"
        />
      </label>

      {alertOnDown && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist">WhatsApp numbers</label>
          <NumberChips numbers={numbers} setNumbers={setNumbers} />
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-flatline/10 px-3 py-2 text-xs text-flatline">{error}</p>
      )}

      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-mist transition hover:bg-raised hover:text-paper"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-xl bg-vital px-4 py-2.5 text-sm font-semibold text-void transition hover:bg-vital/90 disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Plus size={15} />
          )}
          {initial ? "Save changes" : "Add monitor"}
        </button>
      </div>
    </form>
  );
}