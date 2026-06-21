import { useState } from "react";
import { Trash2, Loader2, Check, Server } from "lucide-react";
import Topbar from "../components/Layout/Topbar";
import AlertSettings from "../components/Alerts/AlertSettings";
import Modal from "../components/common/Modal";
import { clearAlerts, BASE_URL } from "../services/api";

export default function Settings() {
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClear = async () => {
    setClearing(true);
    try {
      await clearAlerts();
      setConfirmClear(false);
      setCleared(true);
      setTimeout(() => setCleared(false), 2500);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div>
      <Topbar title="Settings" subtitle="Notification defaults and backend configuration" />

      <div className="px-6 py-6 md:px-8 space-y-6 max-w-2xl">
        <div className="rounded-2xl border border-hairline bg-panel p-5">
          <div className="flex items-center gap-2.5">
            <Server size={16} className="text-mist" />
            <h3 className="font-display text-sm font-semibold text-paper">Backend connection</h3>
          </div>
          <p className="mt-2 font-mono text-xs text-mist">{BASE_URL}</p>
          <p className="mt-1 text-xs text-mist">
            This is configured via the <span className="font-mono text-paper">VITE_API_BASE_URL</span> variable in your .env file.
          </p>
        </div>

        <AlertSettings />

        <div className="rounded-2xl border border-flatline/30 bg-panel p-5">
          <h3 className="font-display text-sm font-semibold text-flatline">Danger zone</h3>
          <p className="mt-1 text-xs text-mist">
            Permanently clear all alert history. Monitors and logs will not be affected.
          </p>
          <button
            onClick={() => setConfirmClear(true)}
            className="mt-3 flex items-center gap-2 rounded-xl border border-flatline/30 px-4 py-2 text-sm font-medium text-flatline transition hover:bg-flatline/10"
          >
            {cleared ? <Check size={14} /> : <Trash2 size={14} />}
            {cleared ? "History cleared" : "Clear all alerts"}
          </button>
        </div>
      </div>

      {confirmClear && (
        <Modal title="Clear alert history?" onClose={() => setConfirmClear(false)}>
          <p className="text-sm text-paper">
            This action cannot be undone — all alerts will be permanently deleted.
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={() => setConfirmClear(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-mist transition hover:bg-raised hover:text-paper"
            >
              Cancel
            </button>
            <button
              onClick={handleClear}
              disabled={clearing}
              className="flex items-center gap-2 rounded-xl bg-flatline px-4 py-2.5 text-sm font-semibold text-void transition hover:bg-flatline/90 disabled:opacity-60"
            >
              {clearing && <Loader2 size={14} className="animate-spin" />}
              Delete all alerts
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}