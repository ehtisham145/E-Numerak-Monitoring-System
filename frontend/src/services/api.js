const BASE_URL = "https://enumerakmonitoringsystem-divbrxhb.b4a.run/";
const TOKEN_KEY = "enumerak_auth_token";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(path, options = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...options,
    });
  } catch (err) {
    throw new ApiError(
      "Could not reach the backend. Check that the server is running.",
      0
    );
  }

  if (res.status === 401 && path !== "/api/auth/login") {
    clearToken();
    window.dispatchEvent(new Event("auth:expired"));
    throw new ApiError("Your session has expired. Please log in again.", 401);
  }

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch (_) {}
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ---------- Auth ----------
export const login = (password) =>
  request("/api/auth/login", { method: "POST", body: JSON.stringify({ password }) });

// ---------- Monitors ----------
export const getMonitors = () => request("/api/monitors/");
export const getMonitor = (id) => request(`/api/monitors/${id}`);
export const createMonitor = (data) =>
  request("/api/monitors/", { method: "POST", body: JSON.stringify(data) });
export const updateMonitor = (id, data) =>
  request(`/api/monitors/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteMonitor = (id) =>
  request(`/api/monitors/${id}`, { method: "DELETE" });
export const toggleMonitor = (id) =>
  request(`/api/monitors/${id}/toggle`, { method: "PATCH" });

// ---------- Alerts ----------
export const getAlerts = () => request("/api/alerts/");
export const getMonitorAlerts = (id) => request(`/api/alerts/monitor/${id}`);
export const clearAlerts = () => request("/api/alerts/clear", { method: "DELETE" });

// ---------- Logs ----------
export const getLogs = () => request("/api/logs/");
export const getMonitorLogs = (id) => request(`/api/logs/monitor/${id}`);

// ---------- Dashboard ----------
export const getDashboardStats = () => request("/api/dashboard/stats");

export { ApiError, BASE_URL };
