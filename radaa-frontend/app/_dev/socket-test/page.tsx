"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";

const TOKEN_STORAGE_KEY = "radaa_auth_token";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export default function SocketTestPage() {
  const { connect, disconnect, emit, on, off, connected } = useSocket();

  const [latency, setLatency] = useState<number | null>(null);
  const [lastPingAt, setLastPingAt] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();

    // eslint-disable-next-line no-console
    console.log("[socket-test] mounting, hasToken=", !!token);

    connect(token ?? undefined);

    const handleConnect = () => {
      // eslint-disable-next-line no-console
      console.log("[socket-test] connected");
    };

    const handleDisconnect = (reason: unknown) => {
      // eslint-disable-next-line no-console
      console.log("[socket-test] disconnected", reason);
    };

    const handleConnectError = (error: unknown) => {
      // eslint-disable-next-line no-console
      console.log("[socket-test] connect_error", error);
      const message =
        error instanceof Error ? error.message : typeof error === "string" ? error : "Connect error";
      setLastError(message);
    };

    on("connect", handleConnect as any);
    on("disconnect", handleDisconnect as any);
    on("connect_error", handleConnectError as any);

    return () => {
      off("connect", handleConnect as any);
      off("disconnect", handleDisconnect as any);
      off("connect_error", handleConnectError as any);
      disconnect();
      // eslint-disable-next-line no-console
      console.log("[socket-test] unmounted, cleaned up");
    };
  }, [connect, disconnect, on, off]);

  useEffect(() => {
    if (!connected) return;

    let cancelled = false;
    let intervalId: number | undefined;

    const sendPing = () => {
      if (cancelled) return;

      const start = performance.now();

      try {
        emit(
          "debug:ping",
          { at: Date.now() },
          () => {
            if (cancelled) return;
            const duration = performance.now() - start;
            setLatency(Math.round(duration));
            setLastPingAt(new Date().toLocaleTimeString());
            // eslint-disable-next-line no-console
            console.log("[socket-test] ping ack in", duration, "ms");
          }
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("[socket-test] ping emit error", error);
      }
    };

    sendPing();
    intervalId = window.setInterval(sendPing, 2000);

    return () => {
      cancelled = true;
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [connected, emit]);

  const handleEmitTestEvent = () => {
    // eslint-disable-next-line no-console
    console.log("[socket-test] emit test event clicked");
    try {
      emit("debug:test_event", { at: new Date().toISOString() });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("[socket-test] emit test event error", error);
    }
  };

  const handleDisconnectClick = () => {
    // eslint-disable-next-line no-console
    console.log("[socket-test] manual disconnect click");
    disconnect();
  };

  return (
    <div className="mx-auto max-w-xl space-y-4 py-6 text-sm">
      <h1 className="text-xl font-semibold tracking-tight">Socket Test</h1>

      <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
        <div>
          Status:{" "}
          <span className={connected ? "text-emerald-400" : "text-red-400"}>
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div>Latency: {latency !== null ? `${latency} ms` : "—"}</div>
        <div>Last ping: {lastPingAt ?? "—"}</div>
        {lastError && <div className="text-xs text-red-400">Last error: {lastError}</div>}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleEmitTestEvent}
          className="inline-flex items-center rounded-md border border-sky-600/60 bg-sky-600/15 px-3 py-1.5 text-xs font-medium text-sky-100 hover:border-sky-400 hover:bg-sky-600/25"
        >
          Emit test event
        </button>
        <button
          type="button"
          onClick={handleDisconnectClick}
          className="inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-red-500/60 hover:bg-red-600/15 hover:text-red-100"
        >
          Disconnect
        </button>
      </div>

      <p className="text-xs text-slate-400">
        Open the browser console to see raw socket events, connection attempts, and ping logs.
      </p>
    </div>
  );
}
