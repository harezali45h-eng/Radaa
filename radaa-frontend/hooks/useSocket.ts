import { useCallback, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

const TOKEN_STORAGE_KEY = "radaa_auth_token";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const REALTIME_URL = `${BASE_URL.replace(/\/+$/, "")}/realtime`;

let socket: Socket | null = null;
let subscriberCount = 0;

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function ensureSocket(token?: string | null): Socket | null {
  if (typeof window === "undefined") return null;

  if (!socket) {
    socket = io(REALTIME_URL, {
      autoConnect: false,
      transports: ["websocket"],
      auth: {
        token: token ?? getStoredToken() ?? undefined
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 10000,
      randomizationFactor: 0.5,
      timeout: 10000
    });
  } else if (token) {
    socket.auth = { ...(socket.auth || {}), token };
  }

  return socket;
}

export interface UseSocket {
  connect: (tokenOverride?: string | null) => void;
  disconnect: () => void;
  emit: (event: string, payload?: any, callback?: (...args: any[]) => void) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
  connected: boolean;
}

export function useSocket(): UseSocket {
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const s = ensureSocket(null);
    if (!s) return;

    subscriberCount += 1;

    const handleConnect = () => {
      setConnected(true);
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleConnectError = (error: unknown) => {
      // eslint-disable-next-line no-console
      console.error("[useSocket] connect_error", error);
    };

    s.on("connect", handleConnect);
    s.on("disconnect", handleDisconnect);
    s.on("connect_error", handleConnectError);

    if (s.connected) {
      setConnected(true);
    }

    return () => {
      if (!socket) return;

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);

      subscriberCount = Math.max(0, subscriberCount - 1);

      if (subscriberCount === 0) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  const connect = useCallback((tokenOverride?: string | null) => {
    if (typeof window === "undefined") return;

    const token = tokenOverride ?? getStoredToken();
    const s = ensureSocket(token);

    if (!s) return;

    if (token) {
      s.auth = { ...(s.auth || {}), token };
    }

    if (!s.connected) {
      s.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (!socket) return;
    socket.disconnect();
  }, []);

  const emit = useCallback(
    (event: string, payload?: any, callback?: (...args: any[]) => void) => {
      const s = socket;
      if (!s) return;

      if (callback) {
        if (payload !== undefined) {
          s.emit(event, payload, callback);
        } else {
          s.emit(event, callback);
        }
      } else if (payload !== undefined) {
        s.emit(event, payload);
      } else {
        s.emit(event);
      }
    },
    []
  );

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    const s = socket;
    if (!s) return;

    s.off(event, callback);
    s.on(event, callback);
  }, []);

  const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
    const s = socket;
    if (!s) return;

    if (callback) {
      s.off(event, callback);
    } else {
      s.removeAllListeners(event);
    }
  }, []);

  return {
    connect,
    disconnect,
    emit,
    on,
    off,
    connected
  };
}
