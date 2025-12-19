"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import {
  getMatatuPhotos,
  uploadMatatuPhoto,
  type MatatuPhoto,
} from "@/lib/api/matatu";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function DriverMatatuPhotosPage() {
  const params = useParams<{ id: string }>();
  const idRaw = params?.id;
  const matatuId =
    typeof idRaw === "string" ? idRaw : Array.isArray(idRaw) ? idRaw[0] : "";

  const { user, token } = useAuth();
  const { addNotification } = useNotifications();

  const role = (user as any)?.role as string | undefined;
  const isDriver = role === "driver";

  const [photos, setPhotos] = useState<MatatuPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matatuId || !token || !isDriver) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMatatuPhotos(matatuId, token);
        if (cancelled) return;
        setPhotos(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load photos";
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
  }, [matatuId, token, isDriver]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    const nextFile = event.target.files?.[0] ?? null;
    if (!nextFile) {
      setFile(null);
      return;
    }

    const objectUrl = URL.createObjectURL(nextFile);
    setFile(nextFile);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!matatuId || !token || !isDriver || !file) return;

    setUploading(true);
    setError(null);
    try {
      const updated = await uploadMatatuPhoto(
        matatuId,
        file,
        caption ? { caption } : {},
        token,
      );
      setPhotos(Array.isArray(updated) ? updated : photos);
      setFile(null);
      setCaption("");
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      addNotification({
        type: "matatu",
        title: "Photo uploaded",
        message: "Your matatu photo is now waiting for review.",
      });
    } catch (err: any) {
      const message =
        err instanceof Error ? err.message : "Failed to upload photo";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isDriver) {
    return (
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Matatu photos
          </h1>
          <p className="text-xs text-slate-300">
            You must be signed in as a driver to manage matatu photos.
          </p>
        </header>
      </div>
    );
  }

  if (!matatuId) {
    return (
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Matatu photos
          </h1>
          <p className="text-xs text-slate-300">
            A valid matatu id is required in the URL.
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Matatu photos
        </h1>
        <p className="text-xs text-slate-300">
          Upload and review photos for this matatu.
        </p>
      </header>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      <Card className="space-y-3 p-4 text-xs">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-2 md:grid-cols-[1.6fr,1.4fr]">
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full cursor-pointer text-[11px] text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-2 file:py-1 file:text-[11px] file:font-medium file:text-slate-100 hover:file:bg-slate-700"
            />
            <input
              type="text"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="Optional caption, e.g. front angle"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <Button type="submit" disabled={!file || uploading} className="text-[11px]">
            {uploading ? "Uploading" : "Upload photo"}
          </Button>
          {previewUrl && (
            <div className="mt-1 flex items-start gap-2">
              <div
                className="h-24 w-32 rounded-md border border-slate-800 bg-slate-900 bg-cover bg-center"
                style={{ backgroundImage: `url(${previewUrl})` }}
              />
              <p className="text-[10px] text-slate-400">
                Preview only. The photo is stored locally until you upload.
              </p>
            </div>
          )}
        </form>
      </Card>

      <Card className="space-y-2 p-4 text-xs">
        <h2 className="text-sm font-semibold text-slate-100">Existing photos</h2>
        {loading && (
          <p className="text-[11px] text-slate-400">Loading photos</p>
        )}
        {!loading && photos.length === 0 && (
          <p className="text-[11px] text-slate-400">
            No photos have been uploaded for this matatu yet.
          </p>
        )}
        {!loading && photos.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo._id}
                className="space-y-1 rounded-md border border-slate-800 bg-slate-950/80 p-2"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || "Matatu photo"}
                  className="h-32 w-full rounded-md object-cover"
                />
                <div className="text-[10px] text-slate-300">
                  {photo.caption || "No caption"}
                </div>
                {photo.status && (
                  <div className="text-[10px] text-slate-400">
                    Status: {photo.status}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
