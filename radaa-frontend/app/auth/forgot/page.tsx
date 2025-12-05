"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <p className="radaa-glass-pill text-[11px] uppercase tracking-[0.18em] text-sunYellow">
          Forgot password
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Reset your password
        </h1>
        <p className="text-sm text-slate-300">
          Enter the email you use with Radaa and we&apos;ll show you how to
          recover access if your account supports password reset.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {submitted ? (
        <div className="space-y-3 text-sm text-slate-200">
          <p>
            If an account exists for <span className="font-medium">{email}</span>,
            you&apos;ll receive instructions shortly.
          </p>
          <p className="text-xs text-slate-400">
            Didn&apos;t get an email? Double-check your spam folder or try a
            different address you may have used.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
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
              placeholder="you@example.com"
            />
          </div>

          <Button type="submit" fullWidth>
            Send reset instructions
          </Button>
        </div>
      )}

      <p className="text-center text-xs text-slate-400">
        Remembered your password?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-sky-400 hover:text-sky-300 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
