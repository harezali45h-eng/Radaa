"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";

export default function RegisterSaccoPage() {
  const { register, loading } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [saccoName, setSaccoName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const saccoOnboardEnabled = useIsFeatureEnabled("sacco_onboard_v1", false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await register({
        username,
        email,
        password,
        phone: phone || undefined,
        role: "admin",
        saccoName,
        registrationNumber: registrationNumber || undefined
      } as any);

      router.push("/dashboard/sacco");
    } catch (err) {
      const message = err instanceof Error ? err.message : "SACCO registration failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = submitting || loading;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">SACCO sign up</h1>
        <p className="text-sm text-slate-300">
          Create a SACCO admin account to manage your fleet, drivers, and documents in Radaa.
        </p>
      </div>

      {saccoOnboardEnabled && (
        <section className="grid gap-2 text-[11px] text-slate-300 md:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
            <div className="text-slate-400">Step 1</div>
            <div className="mt-0.5 font-semibold text-slate-50">SACCO profile</div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
            <div className="text-slate-400">Step 2</div>
            <div className="mt-0.5 font-semibold text-slate-50">Registration details</div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
            <div className="text-slate-400">Step 3</div>
            <div className="mt-0.5 font-semibold text-slate-50">Invite drivers</div>
          </div>
        </section>
      )}

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="username" className="text-sm font-medium text-slate-100">
            Admin name
          </label>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="Jane Doe"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="saccoName" className="text-sm font-medium text-slate-100">
            SACCO name
          </label>
          <input
            id="saccoName"
            type="text"
            required
            value={saccoName}
            onChange={(event) => setSaccoName(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="e.g. Radaa Express SACCO"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="registrationNumber" className="text-sm font-medium text-slate-100">
            Registration number <span className="text-xs font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id="registrationNumber"
            type="text"
            value={registrationNumber}
            onChange={(event) => setRegistrationNumber(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="Your official SACCO registration ID"
          />
        </div>

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
          <label htmlFor="phone" className="text-sm font-medium text-slate-100">
            Phone <span className="text-xs font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="07xx xxx xxx"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-slate-100">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="At least 6 characters"
          />
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDisabled ? "Creating SACCO account..." : "Create SACCO account"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Already have a SACCO account?{" "}
        <Link href="/auth/login-sacco" className="font-medium text-sky-400 hover:text-sky-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
