import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Monitors from "./pages/Monitors";
import Alerts from "./pages/Alerts";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import { useAuth } from "./context/AuthContext";

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <div className="flex min-h-screen bg-void">
              <Sidebar />
              <main className="flex-1 overflow-x-hidden pb-16 md:pb-0">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/monitors" element={<Monitors />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/logs" element={<Logs />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </RequireAuth>
        }
      />
    </Routes>
  );
}
