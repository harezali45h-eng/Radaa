"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";

export default function LoginDriverPage() {
  const { login, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const driverOnboardEnabled = useIsFeatureEnabled("driver_onboard_v1", false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login({ email, password });
      router.push("/dashboard/driver/live");
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
        <h1 className="text-2xl font-semibold tracking-tight">
          Driver sign in
        </h1>
        <p className="text-sm text-slate-300">
          Sign in to access the live driver dashboard and manage ride requests.
        </p>
      </div>

      {driverOnboardEnabled && (
        <div className="rounded-lg border border-emerald-600/50 bg-emerald-600/10 px-3 py-2 text-xs text-emerald-100">
          <p className="font-medium">New driver flow (beta)</p>
          <p className="mt-0.5 text-[11px] text-emerald-100/90">
            Use the driver sign in and live dashboard to test how rides feel
            from behind the wheel. This flow is feature-flagged and safe to
            tweak.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

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
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-100"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDisabled ? "Signing in..." : "Sign in as driver"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Need a driver account?{" "}
        <Link
          href="/auth/register-driver"
          className="font-medium text-emerald-400 hover:text-emerald-300"
        >
          Create one
        </Link>
      </p>

      <p className="text-center text-xs text-slate-500">
        Not a driver?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-sky-400 hover:text-sky-300"
        >
          Go to passenger/admin login
        </Link>
      </p>
    </div>
  );
}
