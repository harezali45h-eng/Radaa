import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { RealtimeProvider } from "@/context/realtimeContext";
import { FeatureFlagProvider } from "@/context/FeatureFlagContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { GoogleMapsProvider } from "@/context/GoogleMapsContext";
import { RideIntentProvider } from "@/context/RideIntentContext";
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
      <body className="min-h-dvh">
        <FeatureFlagProvider>
          <NotificationProvider>
            <AuthProvider>
              <RealtimeProvider>
                <ThemeProvider>
                  <GoogleMapsProvider>
                    <RideIntentProvider>
                      <AppRootClient>{children}</AppRootClient>
                    </RideIntentProvider>
                  </GoogleMapsProvider>
                </ThemeProvider>
              </RealtimeProvider>
            </AuthProvider>
          </NotificationProvider>
        </FeatureFlagProvider>
      </body>
    </html>
  );
}
