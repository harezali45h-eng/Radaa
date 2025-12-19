"use client";

import { FormEvent, useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";

export default function RegisterDriverPage() {
  const { register, loading } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [saccoName, setSaccoName] = useState("");
  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleProfilePhotoChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setProfilePhoto("");
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setProfilePhoto(nextUrl);
  };

  useEffect(() => {
    if (!profilePhoto || !profilePhoto.startsWith("blob:")) {
      return;
    }

    const objectUrl = profilePhoto;
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [profilePhoto]);

  const driverOnboardEnabled = useIsFeatureEnabled("driver_onboard_v1", false);

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
        handle: handle || undefined,
        role: "driver",
        saccoName,
        vehicleRegistration,
        licenseNumber: licenseNumber || undefined,
      });

      router.push("/dashboard/driver/live");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Driver registration failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = submitting || loading;

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Driver sign up
        </h1>
        <p className="text-sm text-slate-300">
          Create a driver account to access the live driver dashboard and accept
          nearby rides.
        </p>
      </div>

      {driverOnboardEnabled && (
        <div className="mt-2 rounded-md border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-100">
          <div className="font-semibold">Fast pilot onboarding</div>
          <p className="mt-0.5">
            After you sign up, you can go live on the map immediately. SACCO/
            admin verification is still required before any payouts or
            subscriptions are released.
          </p>
        </div>
      )}

      {driverOnboardEnabled && (
        <section className="grid gap-2 text-[11px] text-slate-300 md:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
            <div className="text-slate-400">Step 1</div>
            <div className="mt-0.5 font-semibold text-slate-50">
              Account basics
            </div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
            <div className="text-slate-400">Step 2</div>
            <div className="mt-0.5 font-semibold text-slate-50">
              Vehicle details
            </div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
            <div className="text-slate-400">Step 3</div>
            <div className="mt-0.5 font-semibold text-slate-50">
              Optional extras
            </div>
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
          <label
            htmlFor="username"
            className="text-sm font-medium text-slate-100"
          >
            Full name
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
          <label
            htmlFor="handle"
            className="text-sm font-medium text-slate-100"
          >
            Handle{" "}
            <span className="text-xs font-normal text-slate-400">
              (optional)
            </span>
          </label>
          <input
            id="handle"
            type="text"
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="@radaa-driver"
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
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="07xx xxx xxx"
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
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="At least 6 characters"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="saccoName"
            className="text-sm font-medium text-slate-100"
          >
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
          <label
            htmlFor="vehicleRegistration"
            className="text-sm font-medium text-slate-100"
          >
            Vehicle registration
          </label>
          <input
            id="vehicleRegistration"
            type="text"
            required
            value={vehicleRegistration}
            onChange={(event) => setVehicleRegistration(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="e.g. KAA 123A"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="licenseNumber"
            className="text-sm font-medium text-slate-100"
          >
            License number{" "}
            <span className="text-xs font-normal text-slate-400">
              (optional)
            </span>
          </label>
          <input
            id="licenseNumber"
            type="text"
            value={licenseNumber}
            onChange={(event) => setLicenseNumber(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="Your driver license number"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="profilePhoto"
            className="text-sm font-medium text-slate-100"
          >
            Profile photo{" "}
            <span className="text-xs font-normal text-slate-400">
              (optional)
            </span>
          </label>
          <input
            id="profilePhoto"
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 file:mr-3 file:rounded-md file:border-0 file:bg-slate-700 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-600"
          />
          {profilePhoto && (
            <div className="mt-2 flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                <img
                  src={profilePhoto}
                  alt="Selected profile preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                This preview is for your current session only.
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDisabled ? "Creating driver account..." : "Create driver account"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Already have a driver account?{" "}
        <Link
          href="/auth/login-driver"
          className="font-medium text-emerald-400 hover:text-emerald-300"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
