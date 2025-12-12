import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MatatuProfileSheet from "@/src/features/bolt/components/MatatuProfileSheet";
import type { BoltMatatuProfile } from "@/src/features/bolt/types";

const baseMatatu: BoltMatatuProfile = {
  id: "m1",
  plate: "KAA 123A",
  sacco: "Sample Sacco",
  route: "CBD – Westlands",
  speedKph: 32,
  bearing: 90,
  location: { lat: -1.29, lng: 36.82 },
  lastUpdated: new Date("2024-01-01T10:00:00Z").toISOString(),
};

describe("MatatuProfileSheet", () => {
  it("renders basic matatu details", () => {
    render(<MatatuProfileSheet matatu={baseMatatu} />);

    expect(screen.getByText(/Matatu profile/i)).toBeInTheDocument();
    expect(screen.getByText(/KAA 123A/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample Sacco/i)).toBeInTheDocument();
    expect(screen.getByText(/CBD – Westlands/i)).toBeInTheDocument();
  });

  it("renders speed and heading when provided", () => {
    render(<MatatuProfileSheet matatu={baseMatatu} />);

    expect(screen.getByText(/32 km\/h/i)).toBeInTheDocument();
    expect(screen.getByText(/90°/i)).toBeInTheDocument();
  });

  it("renders nothing when matatu is null", () => {
    const { container } = render(<MatatuProfileSheet matatu={null} />);
    expect(container.firstChild).toBeNull();
  });
});
