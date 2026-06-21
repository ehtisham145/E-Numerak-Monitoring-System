import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HeartPulse, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, authError, submitting } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(password);
    if (ok) {
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vital/10 text-vital">
            <HeartPulse size={24} />
          </div>
          <h1 className="mt-4 font-display text-lg font-semibold text-paper">
            E-numerak Monitoring
          </h1>
          <p className="mt-1 text-sm text-mist">Sign in to access the system dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-hairline bg-panel p-6"
        >
          <label className="mb-1.5 block text-xs font-medium text-mist">Password</label>
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your dashboard password"
              autoFocus
              className="w-full rounded-xl border border-hairline bg-void/40 px-3.5 py-2.5 pl-9 pr-10 text-sm text-paper placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-wire/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-paper"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {authError && (
            <p className="mt-3 rounded-lg bg-flatline/10 px-3 py-2 text-xs text-flatline">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !password}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-vital px-4 py-2.5 text-sm font-semibold text-void transition hover:bg-vital/90 disabled:opacity-60"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[11px] text-mist">
          System checks every 60s · Access restricted
        </p>
      </div>
    </div>
  );
}