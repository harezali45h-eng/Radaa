"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedEmail = window.localStorage.getItem("radaa_login_email");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login({ email, password }, rememberMe);

      if (typeof window !== "undefined") {
        if (rememberMe) {
          window.localStorage.setItem("radaa_login_email", email);
        } else {
          window.localStorage.removeItem("radaa_login_email");
        }
      }

      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = submitting || loading;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-slate-300">
          Access your Radaa dashboard to manage matatus, trips, and payments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-100">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-slate-100">
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
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 pr-10 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="••••••••"
              aria-invalid={!!error}
              aria-describedby={error ? "password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-slate-400 hover:text-slate-200 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {error && (
            <p id="password-error" className="text-xs text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label
            htmlFor="rememberMe"
            className="flex items-center space-x-2 text-xs text-slate-300"
          >
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500"
            />
            <span>Remember me on this device</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          aria-busy={isDisabled}
        >
          {isDisabled && (
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
          <span>{isDisabled ? "Signing in..." : "Sign in"}</span>
        </button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-medium text-sky-400 hover:text-sky-300">
          Create one
        </Link>
      </p>
      <p className="text-center text-xs text-slate-400">
        Are you a SACCO admin?{" "}
        <Link
          href="/auth/login-sacco"
          className="font-medium text-sky-400 hover:text-sky-300"
        >
          Sign in to SACCO dashboard
        </Link>
      </p>
      <p className="text-center text-xs text-slate-400">
        Are you a driver?{" "}
        <Link
          href="/auth/login-driver"
          className="font-medium text-emerald-400 hover:text-emerald-300"
        >
          Sign in to driver dashboard
        </Link>
      </p>
    </div>
  );
}
