"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";

export type NotificationType = "trip" | "payment" | "matatu" | "system";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (input: {
    type: NotificationType;
    title: string;
    message: string;
  }) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback(
    (input: { type: NotificationType; title: string; message: string }) => {
      setNotifications((current) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          type: input.type,
          title: input.title,
          message: input.message,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...current,
      ]);
    },
    [],
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((current) => current.map((n) => ({ ...n, read: true })));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "";

    if (!socketUrl) {
      return undefined;
    }

    const url = `${socketUrl.replace(/\/+$/, "")}/realtime`;

    let auth: Record<string, string> | undefined;

    if (typeof window !== "undefined") {
      const storedToken =
        window.localStorage.getItem("token") ||
        window.sessionStorage.getItem("token");

      if (storedToken && typeof storedToken === "string") {
        auth = { token: storedToken };
      }
    }

    if (!auth) {
      return undefined;
    }

    const socket: Socket = io(url, {
      transports: ["websocket"],
      path: "/socket.io",
      auth,
    });

    socket.on("matatu:update", (payload: any) => {
      const plate = payload?.plate || payload?.numberPlate || "Matatu";
      const route = payload?.route;

      addNotification({
        type: "matatu",
        title: "Matatu location update",
        message: route
          ? `${plate} on route ${route} reported a new location.`
          : `${plate} reported a new location.`,
      });
    });

    socket.on("connect_error", () => {
      addNotification({
        type: "system",
        title: "Realtime temporarily unavailable",
        message: "Socket connection failed. Live notifications may be delayed.",
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [addNotification]);

  const value: NotificationContextValue = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAllAsRead,
      markAsRead,
    }),
    [notifications, unreadCount, addNotification, markAllAsRead, markAsRead],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }

  return ctx;
}
