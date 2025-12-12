import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import WalletDashboard from "@/components/WalletDashboard";

jest.mock("@/hooks/useWallet", () => ({
  useWallet: () => ({
    wallet: {
      _id: "wallet-1",
      user: "user-1",
      balance: 1000,
      loyaltyPoints: 0,
      transactions: [],
    },
    loading: false,
    error: null,
    refresh: jest.fn(),
  }),
}));

jest.mock("@/context/FeatureFlagContext", () => ({
  useIsFeatureEnabled: (key: string) => key === "ff_payment_confirm",
}));

jest.mock("@/lib/api", () => {
  const actual = jest.requireActual("@/lib/api");
  return {
    __esModule: true,
    ...actual,
    getPaymentConfirmations: jest.fn().mockResolvedValue([
      {
        _id: "pc-1",
        user: "user-1",
        payment: "pay-1",
        amount: 120,
        currency: "KES",
        purpose: "fare",
        channel: "mpesa",
        status: "success",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        seenAt: null,
        meta: {},
      },
    ]),
    markPaymentConfirmationSeen: jest
      .fn()
      .mockImplementation((id: string) =>
        Promise.resolve({
          _id: id,
          user: "user-1",
          payment: "pay-1",
          amount: 120,
          currency: "KES",
          purpose: "fare",
          channel: "mpesa",
          status: "success",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          seenAt: new Date().toISOString(),
          meta: {},
        }),
      ),
  };
});

describe("WalletDashboard", () => {
  it("renders recent payments section when ff_payment_confirm is enabled", async () => {
    render(<WalletDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/recent payments/i)).toBeInTheDocument();
    });
  });
});
