import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

const SOCKET_URL = (process.env.NEXT_PUBLIC_SOCKET_URL || "").replace(/\/+$/, "");
const SOCKET_NAMESPACE = "/realtime";
let hasWarnedMissingSocketUrl = false;

function ensureSocket(): Socket | null {
  if (typeof window === "undefined") return null;

  if (!SOCKET_URL) {
    if (!hasWarnedMissingSocketUrl && typeof console !== "undefined") {
      console.warn(
        "[sockets] NEXT_PUBLIC_SOCKET_URL is not configured; realtime helpers are disabled (HTTP-only mode).",
      );
      hasWarnedMissingSocketUrl = true;
    }
    return null;
  }

  if (!socket) {
    const url = `${SOCKET_URL}${SOCKET_NAMESPACE}`;
    try {
      socket = io(url, {
        autoConnect: true,
        transports: ["websocket"],
        path: "/socket.io",
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 500,
        reconnectionDelayMax: 10000,
        randomizationFactor: 0.5,
        timeout: 10000,
      });
    } catch (error) {
      if (typeof console !== "undefined") {
        console.error("[sockets] Failed to initialize socket", error);
      }
      socket = null;
      return null;
    }
  }

  return socket;
}

export function connectSocket() {
  return ensureSocket();
}

export function onMatatuUpdate(
  cb: (payload: any) => void,
): () => void {
  const s = ensureSocket();
  if (!s) return () => {};

  const handler = (payload: any) => {
    cb(payload);
  };

  s.on("matatu:live_update", handler);
  s.on("matatus:live_update", handler as any);

  return () => {
    s.off("matatu:live_update", handler);
    s.off("matatus:live_update", handler as any);
  };
}

export function emitEvent(event: string, payload?: any) {
  const s = ensureSocket();
  if (!s) return;
  try {
    if (payload !== undefined) {
      s.emit(event, payload);
    } else {
      s.emit(event);
    }
  } catch (error) {
    if (typeof console !== "undefined") {
      console.error("[sockets] emitEvent error", error);
    }
  }
}
