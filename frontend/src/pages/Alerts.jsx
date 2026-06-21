import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Topbar from "../components/Layout/Topbar";
import AlertHistory from "../components/Alerts/AlertHistory";
import { getAlerts } from "../services/api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await getAlerts();
        if (alive) setAlerts(data);
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 20000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div>
      <Topbar 
        title="Alerts" 
        subtitle="View all downtime and recovery records" 
      />
      <div className="px-6 py-6 md:px-8">
        {error && (
          <div className="mb-5 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-mist">
            <Loader2 className="animate-spin" size={20} />
          </div>
        ) : (
          <AlertHistory alerts={alerts} />
        )}
      </div>
    </div>
  );
}