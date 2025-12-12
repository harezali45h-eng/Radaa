import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RideRequestButton from "@/components/RideRequestButton";

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { phone: "254700000000" },
    token: "test-token",
  }),
}));

jest.mock("@/context/NotificationContext", () => ({
  useNotifications: () => ({
    addNotification: jest.fn(),
  }),
}));

jest.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({
    primaryButtonClass: "",
  }),
}));

jest.mock("@/context/FeatureFlagContext", () => ({
  useIsFeatureEnabled: (key: string) => key === "ff_fare_suggestions",
}));

jest.mock("@/lib/api/rides", () => ({
  requestRide: jest.fn().mockResolvedValue({ _id: "ride-1" }),
  estimateFare: jest
    .fn()
    .mockResolvedValue({ suggestedFare: 123, distanceKm: 3, distanceMeters: 3000 }),
}));

declare global {
  // eslint-disable-next-line no-var
  var navigator: any;
  // eslint-disable-next-line no-var
  var fetch: jest.Mock;
}

describe("RideRequestButton", () => {
  beforeEach(() => {
    global.navigator = {
      geolocation: {
        getCurrentPosition: jest.fn((success: any) => {
          success({ coords: { latitude: 1, longitude: 2 } });
        }),
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as any);

    window.prompt = jest.fn().mockReturnValue("150");
  });

  it("requests a fare estimate when ff_fare_suggestions is enabled", async () => {
    const { estimateFare } = jest.requireMock("@/lib/api/rides");

    render(<RideRequestButton />);

    fireEvent.click(screen.getByRole("button", { name: /request ride/i }));

    await waitFor(() => {
      expect(estimateFare).toHaveBeenCalled();
    });
  });
});
