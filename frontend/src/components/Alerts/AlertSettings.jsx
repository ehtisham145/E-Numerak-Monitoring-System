import { useEffect, useState } from "react";
import { Save, Check } from "lucide-react";

const STORAGE_KEY = "enumerak_default_whatsapp_numbers";

export function getDefaultNumbers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function AlertSettings() {
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(getDefaultNumbers().join(", "));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const numbers = draft
      .split(",")
      .map((n) => n.replace(/\D/g, ""))
      .filter(Boolean);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(numbers));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="rounded-2xl border border-hairline bg-panel p-5">
      <h3 className="font-display text-sm font-semibold text-paper">Default WhatsApp numbers</h3>
      <p className="mt-1 text-xs text-mist">
        These numbers will be automatically suggested when adding a new monitor. You can customize them for individual monitors later if needed.
      </p>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="923271141797, 923xxxxxxxxx"
        rows={2}
        className="mt-3 w-full rounded-xl border border-hairline bg-void/40 px-3.5 py-2.5 font-mono text-sm text-paper placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-wire/40"
      />
      <button
        type="submit"
        className="mt-3 flex items-center gap-2 rounded-xl bg-raised px-4 py-2 text-sm font-medium text-paper transition hover:bg-hairline"
      >
        {saved ? <Check size={14} className="text-vital" /> : <Save size={14} />}
        {saved ? "Saved" : "Save changes"}
      </button>
    </form>
  );
}