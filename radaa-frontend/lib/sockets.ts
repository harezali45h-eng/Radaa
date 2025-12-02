import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

const SOCKET_URL = (process.env.NEXT_PUBLIC_SOCKET_URL || "").replace(/\/+$/, "");
const SOCKET_NAMESPACE = "/realtime";

function ensureSocket(): Socket | null {
  if (typeof window === "undefined") return null;

  if (!socket) {
    const url = `${SOCKET_URL}${SOCKET_NAMESPACE}`;
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
  if (payload !== undefined) {
    s.emit(event, payload);
  } else {
    s.emit(event);
  }
}
