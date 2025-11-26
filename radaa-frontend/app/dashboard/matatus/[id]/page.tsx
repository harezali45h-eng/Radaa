"use client";

import { FormEvent, useEffect, useState, ChangeEvent } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMatatuPhotos, uploadMatatuPhoto, type MatatuPhoto } from "@/lib/api/matatu";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Matatu {
  _id: string;
  plate?: string;
  route?: string;
  sacco?: string;
  driverName?: string;
  driverPhone?: string;
  status?: string;
  location?: {
    lat?: number;
    lng?: number;
  };
  isOnline?: boolean;
  lastUpdated?: string;
}

export default function MatatuDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { token } = useAuth();

  const [matatu, setMatatu] = useState<Matatu | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const [photos, setPhotos] = useState<MatatuPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState<boolean>(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoCaption, setPhotoCaption] = useState<string>("");
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BACKEND_URL}/matatus/${id}`);

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Failed to load matatu");
        }

        const data = (await response.json()) as Matatu;
        setMatatu(data);

        if (data.location?.lat != null) {
          setLat(String(data.location.lat));
        }
        if (data.location?.lng != null) {
          setLng(String(data.location.lng));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load matatu";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const run = async () => {
      setLoadingPhotos(true);
      setPhotoError(null);

      try {
        const data = await getMatatuPhotos(id, token);
        if (cancelled) return;
        setPhotos(data);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load photos";
        setPhotoError(message);
      } finally {
        if (!cancelled) {
          setLoadingPhotos(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [id, token]);

  const handleUpdateLocation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    setUpdating(true);
    setUpdateMessage(null);

    try {
      const response = await fetch(`${BACKEND_URL}/matatus/${id}/location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ lat, lng })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (data && typeof data === "object" && (data.message || data.error)) ||
          "Failed to update location";
        throw new Error(message);
      }

      setUpdateMessage("Location updated successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update location";
      setUpdateMessage(message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePhotoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPhotoFile(file);
  };

  const handleUploadPhoto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id || !photoFile) return;

    setUploadingPhoto(true);
    setPhotoError(null);

    try {
      const updated = await uploadMatatuPhoto(id, photoFile, { caption: photoCaption || undefined }, token);
      setPhotos(updated);
      setPhotoFile(null);
      setPhotoCaption("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload photo";
      setPhotoError(message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
          Loading matatu details...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && matatu && (
        <>
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">{matatu.plate}</h1>
            <p className="text-xs text-slate-300">Route: {matatu.route}</p>
            {matatu.sacco && (
              <p className="text-xs text-slate-400">Sacco: {matatu.sacco}</p>
            )}
          </header>

          <section className="grid gap-4 md:grid-cols-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-slate-400">Driver</div>
              <div className="mt-1 text-slate-100">
                {matatu.driverName || "Not set"}
                {matatu.driverPhone && (
                  <span className="text-slate-500"> · {matatu.driverPhone}</span>
                )}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-slate-400">Status</div>
              <div className="mt-1 text-slate-100">
                {matatu.isOnline ? "Online" : "Offline"}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-slate-400">Last location</div>
              <div className="mt-1 text-slate-100">
                {matatu.location?.lat != null && matatu.location?.lng != null
                  ? `${matatu.location.lat.toFixed(4)}, ${matatu.location.lng.toFixed(4)}`
                  : "Not set"}
              </div>
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">Update live location</h2>
                <p className="text-[11px] text-slate-400">
                  Send a one-off location update for this matatu. This will also broadcast over
                  Socket.IO to any live map subscribers.
                </p>
              </div>
            </div>

            {updateMessage && (
              <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-200">
                {updateMessage}
              </div>
            )}

            <form onSubmit={handleUpdateLocation} className="grid gap-3 md:grid-cols-[1fr,1fr,auto]">
              <div className="space-y-1">
                <label htmlFor="lat" className="text-[11px] font-medium text-slate-100">
                  Latitude
                </label>
                <input
                  id="lat"
                  type="number"
                  step="0.0001"
                  required
                  value={lat}
                  onChange={(event) => setLat(event.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  placeholder="-1.2864"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="lng" className="text-[11px] font-medium text-slate-100">
                  Longitude
                </label>
                <input
                  id="lng"
                  type="number"
                  step="0.0001"
                  required
                  value={lng}
                  onChange={(event) => setLng(event.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  placeholder="36.8219"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-[11px] font-medium text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updating ? "Updating..." : "Update location"}
                </button>
              </div>
            </form>
          </section>

          <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">Photos</h2>
                <p className="text-[11px] text-slate-400">
                  Upload photos of this matatu. Approved photos will be used on the global map and in
                  SACCO dashboards.
                </p>
              </div>
            </div>

            {photoError && (
              <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
                {photoError}
              </div>
            )}

            {loadingPhotos && (
              <div className="text-[11px] text-slate-300">Loading photos…</div>
            )}

            {!loadingPhotos && photos.length > 0 && (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {photos.map((p) => {
                  const src = p.url.startsWith("http") ? p.url : `${BACKEND_URL}${p.url}`;
                  return (
                    <figure key={p._id} className="space-y-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={p.caption || "Matatu photo"}
                        className="h-24 w-full rounded-md object-cover"
                      />
                      <figcaption className="text-[10px] text-slate-400">
                        {p.caption || "Matatu"} · {p.status || "pending"}
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            )}

            <form
              onSubmit={handleUploadPhoto}
              className="mt-2 grid gap-2 md:grid-cols-[1.4fr,1.6fr,auto]"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoFileChange}
                className="block w-full cursor-pointer text-[11px] text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-2 file:py-1 file:text-[11px] file:font-medium file:text-slate-100 hover:file:bg-slate-700"
              />
              <input
                type="text"
                value={photoCaption}
                onChange={(event) => setPhotoCaption(event.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                placeholder="Caption (optional)"
              />
              <button
                type="submit"
                disabled={uploadingPhoto || !photoFile}
                className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-[11px] font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadingPhoto ? "Uploading..." : "Upload photo"}
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}
