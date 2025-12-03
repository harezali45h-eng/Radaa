"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedEmail = window.localStorage.getItem("radaa_login_email");
    if (storedEmail) {
      setEmail(storedEmail);
      setRemember(true);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldError(null);
    setLoading(true);

    try {
      const loginBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "";

      const res = await fetch(`${loginBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log("LOGIN RESPONSE --->", data);
      }

      const payload =
        data && typeof data === "object" && "data" in (data as any)
          ? (data as any).data
          : data;

      const token = (payload as any)?.token;

      if (!payload || typeof token !== "string") {
        const message =
          (payload as any)?.message ||
          (data as any)?.message ||
          (!res.ok ? "Invalid credentials" : "Invalid login response");
        throw new Error(message);
      }

      if (typeof window !== "undefined") {
        if (remember) {
          window.localStorage.setItem("radaa_login_email", email);
        } else {
          window.localStorage.removeItem("radaa_login_email");
        }
      }

      await login(payload as any, { remember });

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      const message = err?.message || "Login failed";
      setError(message);
      setFieldError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="radaa-login-bg">
      <div className="relative mx-auto flex w-full max-w-md flex-col justify-center py-6 sm:min-h-[70vh]">
      <noscript>
        <div className="mb-4 rounded-md border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-100">
          JavaScript is disabled in your browser. Please enable JavaScript to
          sign in to your Radaa account.
        </div>
      </noscript>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-100 shadow-sm"
        >
          {error}
        </div>
      )}

      <Card className="bg-slate-950/40 p-6 shadow-glass-elevated">
        <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
          <div className="space-y-2">
          <p className="radaa-glass-pill text-[11px] uppercase tracking-[0.18em] text-sunYellow">
            Karibu Radaa
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Sign in
          </h1>
          <p className="text-sm text-slate-300">
            Access live matatu tracking, driver perks, and SACCO controls — all
            in one dashboard.
          </p>
          </div>

          <div className="space-y-1">
          <label
            htmlFor="email"
            className="text-sm font-medium text-slate-100"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 outline-none ring-0 transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-100"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 pr-10 text-sm text-slate-50 placeholder:text-slate-500 outline-none ring-0 transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
              aria-invalid={!!fieldError}
              aria-describedby={fieldError ? "password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-slate-400 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {fieldError && (
            <p
              id="password-error"
              className="text-xs text-red-400"
              role="alert"
            >
              {fieldError}
            </p>
          )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-500"
            />
            <span>Remember me on this device</span>
          </label>
          <Link
            href="/auth/forgot"
            className="rounded text-sky-400 hover:text-sky-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Forgot?
          </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            fullWidth
          >
          {loading && (
            <svg
              className="mr-2 h-4 w-4 animate-spin text-sky-100"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
            <span>{loading ? "Signing in…" : "Sign in"}</span>
          </Button>

          <p className="pt-1 text-center text-xs text-slate-300">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-sky-400 hover:text-sky-300 hover:underline"
          >
            Create one
          </Link>
          </p>

          <p className="text-center text-xs text-slate-300">
          Are you a SACCO admin?{" "}
          <Link
            href="/auth/login-sacco"
            className="font-medium text-sky-400 hover:text-sky-300 hover:underline"
          >
            Sign in to SACCO dashboard
          </Link>
          </p>

          <p className="text-center text-xs text-slate-400">
          Are you a driver?{" "}
          <Link
            href="/auth/login-driver"
            className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            Sign in to driver dashboard
          </Link>
          </p>
        </form>
      </Card>
      </div>
    </div>
  );
}
