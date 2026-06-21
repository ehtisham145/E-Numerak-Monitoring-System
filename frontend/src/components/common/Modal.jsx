import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ title, children, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 backdrop-blur-sm p-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-hairline bg-panel shadow-2xl">
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-paper">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-mist transition hover:bg-raised hover:text-paper"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
