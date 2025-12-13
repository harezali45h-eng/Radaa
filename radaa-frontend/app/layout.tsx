import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { RealtimeProvider } from "@/context/realtimeContext";
import { FeatureFlagProvider } from "@/context/FeatureFlagContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppRootClient } from "@/components/layout/AppRootClient";

export const metadata: Metadata = {
  title: "Radaa – Kaa Radaa ujue mat yako iko wapi",
  description: "Kaa Radaa ujue mat yako iko wapi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <FeatureFlagProvider>
          <NotificationProvider>
            <AuthProvider>
              <RealtimeProvider>
                <ThemeProvider>
                  <AppRootClient>{children}</AppRootClient>
                </ThemeProvider>
              </RealtimeProvider>
            </AuthProvider>
          </NotificationProvider>
        </FeatureFlagProvider>
      </body>
    </html>
  );
}
