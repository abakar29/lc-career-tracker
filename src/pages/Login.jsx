import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Button } from "../components/ui";

const GUEST_KEY = "abuve:guest";

const LC_EMAIL_DOMAIN = "@lclark.edu";
const ORANGE = "#F36F21";

function isLcEmail(email) {
  return email.toLowerCase().trim().endsWith(LC_EMAIL_DOMAIN);
}

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setInfo("");
  }

  function handleGuestLogin() {
    localStorage.setItem(GUEST_KEY, "true");
    window.location.href = "/";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!isLcEmail(email)) {
      setError("Only Lewis & Clark email addresses are allowed");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error: authError } =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (mode === "signup") {
      setInfo("Account created. Check your email to confirm before signing in.");
    }
  }

  return (
    <div
      className="px-4"
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url(/lc-campus.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(26, 23, 20, 0.65)" }} />
      <div
        className="w-full max-w-[400px] bg-white dark:bg-[#232428] dark:border dark:border-white/10 rounded-2xl shadow-sm p-8"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <img src="/lc-logo.png" alt="" className="h-14 w-14 object-contain mb-3" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-[#F8F9FA]">Abuve</h1>
          <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
            Lewis &amp; Clark College Career Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@lclark.edu"
              className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1A1919] px-3 py-2 text-sm text-slate-900 dark:text-[#F8F9FA] placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#F36F21] focus:border-[#F36F21]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1A1919] px-3 py-2 text-sm text-slate-900 dark:text-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#F36F21] focus:border-[#F36F21]"
            />
          </div>

          {mode === "signup" && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1A1919] px-3 py-2 text-sm text-slate-900 dark:text-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#F36F21] focus:border-[#F36F21]"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          {info && <p className="text-sm text-orange-600 dark:text-orange-300">{info}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Please wait..." : mode === "signup" ? "Sign Up" : "Sign In"}
          </Button>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 bg-white dark:bg-white/5 border-[1.5px] border-[#F36F21] text-[#B85A12] dark:text-orange-300"
          >
            Continue as Guest Demo
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-neutral-400 mt-5">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="font-medium hover:underline"
                style={{ color: ORANGE }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-medium hover:underline"
                style={{ color: ORANGE }}
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
