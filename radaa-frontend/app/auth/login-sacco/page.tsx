"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";

export default function LoginSaccoPage() {
  const { login, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const saccoOnboardEnabled = useIsFeatureEnabled("sacco_onboard_v1", false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login({ email, password });
      router.push("/dashboard/sacco");
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
        <h1 className="text-2xl font-semibold tracking-tight">SACCO sign in</h1>
        <p className="text-sm text-slate-300">
          Sign in as a SACCO admin to manage your fleet and drivers in Radaa.
        </p>
      </div>

      {saccoOnboardEnabled && (
        <div className="rounded-lg border border-sky-600/60 bg-sky-600/10 px-3 py-2 text-xs text-sky-100">
          <p className="font-medium">New SACCO dashboard (beta)</p>
          <p className="mt-0.5 text-[11px] text-sky-100/90">
            Use this admin sign-in to explore the experimental SACCO fleet dashboard. This experience
            is safely feature-flagged while we iterate.
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
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-slate-100">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDisabled ? "Signing in..." : "Sign in as SACCO"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Need a SACCO account?{" "}
        <Link href="/auth/register-sacco" className="font-medium text-sky-400 hover:text-sky-300">
          Create one
        </Link>
      </p>

      <p className="text-center text-xs text-slate-500">
        Not a SACCO admin?{" "}
        <Link href="/auth/login" className="font-medium text-sky-400 hover:text-sky-300">
          Go to main login
        </Link>
      </p>
    </div>
  );
}
