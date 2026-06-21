import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { login as apiLogin, getToken, setToken, clearToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken());
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onExpired = () => {
      clearToken();
      setTokenState(null);
    };
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, []);

  const login = useCallback(async (password) => {
    setSubmitting(true);
    setAuthError("");
    try {
      const data = await apiLogin(password);
      setToken(data.access_token);
      setTokenState(data.access_token);
      return true;
    } catch (err) {
      setAuthError(err.message || "Login failed.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        login,
        logout,
        authError,
        submitting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
