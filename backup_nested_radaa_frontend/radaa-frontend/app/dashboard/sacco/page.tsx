"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getSaccoOverview,
  getSaccoDrivers,
  getSaccoMatatus,
  uploadSaccoDoc,
  setDriverEnabled,
  setDriverVerification,
  setMatatuApproval,
  type SaccoOverview,
  type SaccoDriver,
  type SaccoMatatu,
} from "@/lib/api/sacco";
import { useIsFeatureEnabled } from "@/context/FeatureFlagContext";
import MapContainer from "@/components/map/MapContainer";
import { useRealtime } from "@/context/realtimeContext";
import { useTheme } from "@/context/ThemeContext";
import { Badge } from "@/components/ui/Badge";

interface FleetLatLng {
  lat: number;
  lng: number;
}

interface FleetBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface FleetMatatu {
  id: string;
  plate?: string;
  numberPlate?: string;
  route?: string;
  location?: FleetLatLng | null;
  status?: string;
}

export default function SaccoDashboardPage() {
  const { user, token } = useAuth();

  const saccoId = (user as any)?._id as string | undefined;
  const saccoName = (user as any)?.saccoProfile?.saccoName as
    | string
    | undefined;

  const [overview, setOverview] = useState<SaccoOverview | null>(null);
  const [drivers, setDrivers] = useState<SaccoDriver[]>([]);
  const [matatus, setMatatus] = useState<SaccoMatatu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [docType, setDocType] = useState<
    "logo" | "permit" | "insurance" | "compliance"
  >("permit");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const { matatus: realtimeMatatus } = useRealtime();
  const [selectedFleetMatatuId, setSelectedFleetMatatuId] = useState<
    string | null
  >(null);

  const isAdmin = (user as any)?.role === "admin";

  const saccoOnboardEnabled = useIsFeatureEnabled("sacco_onboard_v1", false);
  const { cardSurfaceClass } = useTheme();

  useEffect(() => {
    if (!saccoId || !token || !isAdmin) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const [ov, drv, mats] = await Promise.all([
          getSaccoOverview(saccoId, token),
          getSaccoDrivers(saccoId, token),
          getSaccoMatatus(saccoId, {}, token),
        ]);

        if (cancelled) return;

        setOverview(ov);
        setDrivers(drv);
        setMatatus(mats);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load SACCO data";
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [saccoId, token, isAdmin]);

  const pendingDrivers = useMemo(
    () => drivers.filter((d) => d.driverVerificationStatus === "pending"),
    [drivers],
  );

  const pendingMatatus = useMemo(
    () => matatus.filter((m) => m.approvalStatus === "pending"),
    [matatus],
  );

  const fleetMatatus = useMemo<FleetMatatu[]>(() => {
    if (!Array.isArray(matatus) || matatus.length === 0) {
      return [];
    }

    const byId = new Map<string, SaccoMatatu>(matatus.map((m) => [m._id, m]));
    const byDriver = new Map<string, SaccoMatatu>();
    matatus.forEach((m) => {
      if (m.driver) {
        byDriver.set(String(m.driver), m);
      }
    });

    return realtimeMatatus
      .map((rt) => {
        const rtAny = rt as any;
        const primaryId = rt.id;
        const matatuId = (rtAny.matatuId as string | undefined) || undefined;
        const driverId = (rtAny.driverId as string | undefined) || undefined;

        let base: SaccoMatatu | undefined = undefined;
        if (matatuId && byId.has(matatuId)) {
          base = byId.get(matatuId) as SaccoMatatu;
        } else if (primaryId && byId.has(primaryId)) {
          base = byId.get(primaryId) as SaccoMatatu;
        } else if (driverId && byDriver.has(driverId)) {
          base = byDriver.get(driverId) as SaccoMatatu;
        }

        if (!base) {
          return null;
        }

        const canonicalId = base._id;

        return {
          id: canonicalId,
          plate: base.plate || base.numberPlate || rt.plate,
          numberPlate: base.numberPlate || rt.numberPlate,
          route: base.route || rt.route,
          location: rt.location ?? null,
          status: rt.status,
        };
      })
      .filter(Boolean) as FleetMatatu[];
  }, [matatus, realtimeMatatus]);

  const fleetBounds = useMemo<FleetBounds | null>(() => {
    const locations: FleetLatLng[] = [];

    fleetMatatus.forEach((m) => {
      const loc = m.location;
      if (loc && typeof loc.lat === "number" && typeof loc.lng === "number") {
        locations.push(loc);
      }
    });

    if (locations.length === 0) {
      return null;
    }

    let minLat = locations[0].lat;
    let maxLat = locations[0].lat;
    let minLng = locations[0].lng;
    let maxLng = locations[0].lng;

    locations.forEach((loc) => {
      if (loc.lat < minLat) minLat = loc.lat;
      if (loc.lat > maxLat) maxLat = loc.lat;
      if (loc.lng < minLng) minLng = loc.lng;
      if (loc.lng > maxLng) maxLng = loc.lng;
    });

    return { minLat, maxLat, minLng, maxLng };
  }, [fleetMatatus]);

  const fleetHasAnyLocation = useMemo(
    () => fleetBounds !== null,
    [fleetBounds],
  );

  const fleetProject = useCallback(
    (location: FleetLatLng | null | undefined) => {
      if (!location || !fleetBounds) {
        return { left: "50%", top: "50%" };
      }

      const latRange = Math.max(
        fleetBounds.maxLat - fleetBounds.minLat,
        0.0001,
      );
      const lngRange = Math.max(
        fleetBounds.maxLng - fleetBounds.minLng,
        0.0001,
      );

      const x = ((location.lng - fleetBounds.minLng) / lngRange) * 100;
      const y = 100 - ((location.lat - fleetBounds.minLat) / latRange) * 100;

      return {
        left: `${Math.min(100, Math.max(0, x))}%`,
        top: `${Math.min(100, Math.max(0, y))}%`,
      };
    },
    [fleetBounds],
  );

  const fleetDisplayPositions = useMemo(
    () =>
      fleetMatatus.reduce<Record<string, FleetLatLng>>((acc, m) => {
        if (m.location) {
          acc[m.id] = m.location;
        }
        return acc;
      }, {}),
    [fleetMatatus],
  );

  const handleDocFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setDocFile(file);
  };

  const handleUploadDoc = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!saccoId || !token || !docFile) return;

    setUploadingDoc(true);

    try {
      await uploadSaccoDoc(saccoId, docType, docFile, token);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Document upload failed";
      setError(message);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDriverVerification = async (
    driverId: string,
    status: "approved" | "rejected",
  ) => {
    if (!saccoId || !token) return;
    try {
      const updated = await setDriverVerification(
        saccoId,
        driverId,
        status,
        token,
      );
      setDrivers((prev) =>
        prev.map((d) => (d._id === updated._id ? updated : d)),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update driver";
      setError(message);
    }
  };

  const handleDriverEnabledToggle = async (
    driverId: string,
    enabled: boolean,
  ) => {
    if (!saccoId || !token) return;
    try {
      const updated = await setDriverEnabled(saccoId, driverId, enabled, token);
      setDrivers((prev) =>
        prev.map((d) => (d._id === updated._id ? updated : d)),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update driver";
      setError(message);
    }
  };

  const handleMatatuApproval = async (
    matatuId: string,
    status: "approved" | "rejected",
  ) => {
    if (!saccoId || !token) return;
    try {
      const updated = await setMatatuApproval(saccoId, matatuId, status, token);
      setMatatus((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m)),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update matatu";
      setError(message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            SACCO dashboard
          </h1>
          <p className="text-xs text-slate-300">
            You must be signed in as a SACCO admin to view this dashboard.
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          SACCO dashboard
        </h1>
        <p className="text-xs text-slate-300">
          High-level overview of your SACCO performance, drivers, and fleet.
        </p>
        {saccoName && (
          <p className="text-[11px] text-slate-400">Managing: {saccoName}</p>
        )}
      </header>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      <section className="grid gap-3 md:grid-cols-3">
        <div className={`${cardSurfaceClass} p-4 text-xs`}>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Active matatus
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {overview?.activeMatatus ?? (loading ? "…" : 0)}
          </div>
        </div>
        <div className={`${cardSurfaceClass} p-4 text-xs`}>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Active trips
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {overview?.activeTrips ?? (loading ? "…" : 0)}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Completed last hour
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {overview?.completedTripsLastHour ?? (loading ? "…" : 0)}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[2fr,1.2fr]">
        <div className={`space-y-3 ${cardSurfaceClass} p-4 text-xs`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Drivers</h2>
              <p className="text-[11px] text-slate-400">
                Manage your drivers, status and access.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950/70">
            <table className="min-w-full border-collapse text-[11px]">
              <thead className="bg-slate-900/80 text-slate-300">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Driver</th>
                  <th className="px-3 py-2 text-left font-medium">Vehicle</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Verification
                  </th>
                  <th className="px-3 py-2 text-left font-medium">Enabled</th>
                  <th className="px-3 py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((d) => (
                  <tr key={d._id} className="border-t border-slate-800/80">
                    <td className="px-3 py-2 text-slate-100">
                      <div className="flex flex-col">
                        <span className="font-medium">{d.username}</span>
                        <span className="text-[10px] text-slate-400">
                          {d.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {d.driverProfile?.vehicleRegistration ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      <Badge
                        tone={
                          d.driverVerificationStatus === "approved"
                            ? "success"
                            : d.driverVerificationStatus === "rejected"
                              ? "danger"
                              : "warning"
                        }
                        soft
                      >
                        {d.driverVerificationStatus ?? "pending"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <Badge tone={d.enabled ? "success" : "muted"} soft>
                        {d.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleDriverVerification(d._id, "approved")
                          }
                          className="rounded-full bg-emerald-600/80 px-2 py-0.5 text-[10px] text-emerald-50 hover:bg-emerald-500/80"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDriverVerification(d._id, "rejected")
                          }
                          className="rounded-full bg-red-600/70 px-2 py-0.5 text-[10px] text-red-50 hover:bg-red-500/80"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDriverEnabledToggle(d._id, !d.enabled)
                          }
                          className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-100 hover:bg-slate-700"
                        >
                          {d.enabled ? "Disable" : "Enable"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
          <h2 className="text-sm font-semibold text-slate-100">
            Compliance documents
          </h2>
          <p className="text-[11px] text-slate-400">
            Upload core SACCO documents like permits and insurance. Files are
            stored securely on the backend.
          </p>

          <form onSubmit={handleUploadDoc} className="space-y-2">
            <div className="grid gap-2 md:grid-cols-[1.4fr,1.6fr]">
              <select
                value={docType}
                onChange={(event) =>
                  setDocType(
                    event.target.value as
                      | "logo"
                      | "permit"
                      | "insurance"
                      | "compliance",
                  )
                }
                className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              >
                <option value="permit">Permit</option>
                <option value="insurance">Insurance</option>
                <option value="compliance">Compliance doc</option>
                <option value="logo">Logo</option>
              </select>
              <input
                type="file"
                onChange={handleDocFileChange}
                className="block w-full cursor-pointer text-[11px] text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-2 file:py-1 file:text-[11px] file:font-medium file:text-slate-100 hover:file:bg-slate-700"
              />
            </div>
            <button
              type="submit"
              disabled={!docFile || uploadingDoc}
              className="inline-flex items-center rounded-md bg-sky-600 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadingDoc ? "Uploading..." : "Upload document"}
            </button>
          </form>
        </div>
      </section>

      <section className={`space-y-3 ${cardSurfaceClass} p-4 text-xs`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Fleet</h2>
            <p className="text-[11px] text-slate-400">
              Vehicles registered under this SACCO and their approval status.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950/70">
          <table className="min-w-full border-collapse text-[11px]">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Matatu</th>
                <th className="px-3 py-2 text-left font-medium">Route</th>
                <th className="px-3 py-2 text-left font-medium">Approval</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matatus.map((m) => (
                <tr key={m._id} className="border-t border-slate-800/80">
                  <td className="px-3 py-2 text-slate-100">
                    {m.plate || m.numberPlate || m._id.slice(0, 6)}
                  </td>
                  <td className="px-3 py-2 text-slate-300">{m.route ?? "—"}</td>
                  <td className="px-3 py-2">
                    <Badge
                      tone={
                        m.approvalStatus === "approved"
                          ? "success"
                          : m.approvalStatus === "rejected"
                            ? "danger"
                            : "warning"
                      }
                      soft
                    >
                      {m.approvalStatus ?? "pending"}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleMatatuApproval(m._id, "approved")}
                        className="rounded-full bg-emerald-600/80 px-2 py-0.5 text-[10px] text-emerald-50 hover:bg-emerald-500/80"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMatatuApproval(m._id, "rejected")}
                        className="rounded-full bg-red-600/70 px-2 py-0.5 text-[10px] text-red-50 hover:bg-red-500/80"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className={`space-y-2 ${cardSurfaceClass} p-4 text-xs`}>
          <h3 className="text-sm font-semibold text-slate-100">
            Pending driver approvals
          </h3>
          {pendingDrivers.length === 0 && (
            <p className="text-[11px] text-slate-400">
              No pending drivers right now.
            </p>
          )}
          {pendingDrivers.length > 0 && (
            <ul className="space-y-1 text-[11px] text-slate-200">
              {pendingDrivers.map((d) => (
                <li key={d._id} className="flex items-center justify-between">
                  <span>{d.username}</span>
                  <div className="inline-flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleDriverVerification(d._id, "approved")
                      }
                      className="rounded-full bg-emerald-600/80 px-2 py-0.5 text-[10px] text-emerald-50 hover:bg-emerald-500/80"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDriverVerification(d._id, "rejected")
                      }
                      className="rounded-full bg-red-600/70 px-2 py-0.5 text-[10px] text-red-50 hover:bg-red-500/80"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
          <h3 className="text-sm font-semibold text-slate-100">
            Pending matatu approvals
          </h3>
          {pendingMatatus.length === 0 && (
            <p className="text-[11px] text-slate-400">
              No pending matatus right now.
            </p>
          )}
          {pendingMatatus.length > 0 && (
            <ul className="space-y-1 text-[11px] text-slate-200">
              {pendingMatatus.map((m) => (
                <li key={m._id} className="flex items-center justify-between">
                  <span>{m.plate || m.numberPlate || m._id.slice(0, 6)}</span>
                  <div className="inline-flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleMatatuApproval(m._id, "approved")}
                      className="rounded-full bg-emerald-600/80 px-2 py-0.5 text-[10px] text-emerald-50 hover:bg-emerald-500/80"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMatatuApproval(m._id, "rejected")}
                      className="rounded-full bg-red-600/70 px-2 py-0.5 text-[10px] text-red-50 hover:bg-red-500/80"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
