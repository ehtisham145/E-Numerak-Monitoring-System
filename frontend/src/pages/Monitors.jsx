import { useEffect, useState } from "react";
import { Plus, Loader2, AlertTriangle } from "lucide-react";
import Topbar from "../components/Layout/Topbar";
import MonitorList from "../components/Monitors/MonitorList";
import MonitorForm from "../components/Monitors/MonitorForm";
import Modal from "../components/common/Modal";
import {
  getMonitors,
  createMonitor,
  updateMonitor,
  deleteMonitor,
  toggleMonitor,
} from "../services/api";

export default function Monitors() {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // { mode: 'add' | 'edit', monitor }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const data = await getMonitors();
      setMonitors(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (modal.mode === "edit") {
        await updateMonitor(modal.monitor.id, payload);
      } else {
        await createMonitor(payload);
      }
      setModal(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (monitor) => {
    try {
      await toggleMonitor(monitor.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMonitor(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Topbar title="Monitors" subtitle="Manage all your active services" />

      <div className="px-6 py-6 md:px-8">
        {error && (
          <div className="mb-5 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
            {error}
          </div>
        )}

        <div className="mb-5 flex items-center justify-end">
          <button
            onClick={() => setModal({ mode: "add" })}
            className="flex items-center gap-2 rounded-xl bg-vital px-4 py-2.5 text-sm font-semibold text-void transition hover:bg-vital/90"
          >
            <Plus size={15} />
            Add New Monitor
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-mist">
            <Loader2 className="animate-spin" size={20} />
          </div>
        ) : (
          <MonitorList
            monitors={monitors}
            onEdit={(m) => setModal({ mode: "edit", monitor: m })}
            onDelete={(m) => setDeleteTarget(m)}
            onToggle={handleToggle}
            onAddNew={() => setModal({ mode: "add" })}
          />
        )}
      </div>

      {modal && (
        <Modal
          title={modal.mode === "edit" ? "Edit monitor" : "Add new monitor"}
          onClose={() => setModal(null)}
        >
          <MonitorForm
            initial={modal.mode === "edit" ? modal.monitor : null}
            onSubmit={handleSubmit}
            onCancel={() => setModal(null)}
            submitting={submitting}
          />
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete monitor?" onClose={() => setDeleteTarget(null)}>
          <div className="flex items-start gap-3 rounded-xl bg-flatline/10 px-4 py-3">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-flatline" />
            <p className="text-sm text-paper">
              <strong>{deleteTarget.name}</strong> will be permanently deleted, along with its history. This action cannot be undone.
            </p>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-mist transition hover:bg-raised hover:text-paper"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="rounded-xl bg-flatline px-4 py-2.5 text-sm font-semibold text-void transition hover:bg-flatline/90"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}