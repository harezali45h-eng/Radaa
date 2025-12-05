import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "@/app/auth/login/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: jest.fn().mockResolvedValue(undefined),
  }),
}));

declare global {
  // eslint-disable-next-line no-var
  var fetch: jest.Mock;
}

describe("LoginPage", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    window.localStorage.clear();
  });

  it("submits credentials and navigates on successful login", async () => {
    const payload = {
      _id: "user-id",
      email: "user@example.com",
      username: "User",
      phone: "+254700000000",
      handle: "@user",
      token: "test-token",
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => payload,
    } as any);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("shows an error when credentials are invalid", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    } as any);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrong" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
