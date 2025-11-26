import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { RealtimeProvider } from "@/context/realtimeContext";

export const metadata: Metadata = {
  title: "Radaa",
  description: "Live matatu tracking and loyalty rides"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <NotificationProvider>
          <AuthProvider>
            <RealtimeProvider>{children}</RealtimeProvider>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
