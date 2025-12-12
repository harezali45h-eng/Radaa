import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/src/features/bolt/hooks/useBoltRideRequest", () => ({
  useBoltRideRequest: () => ({
    requestRideTo: jest.fn(),
  }),
}));

jest.mock("@/src/features/bolt/hooks/useBoltLiveRadar", () => ({
  useBoltLiveRadar: () => ({
    matatus: [],
    displayPositions: {},
    bounds: null,
    setBounds: jest.fn(),
    loading: false,
    hasAnyLocation: false,
  }),
}));

jest.mock("@/src/features/bolt/components/LiveRadarMap", () => () => (
  <div>Mock LiveRadarMap</div>
));

jest.mock("@/src/features/bolt/components/TinderGallery", () => () => (
  <div>Mock TinderGallery</div>
));

jest.mock("@/src/features/bolt/components/MatatuProfileSheet", () => () => null);

jest.mock("@/src/features/bolt/components/WhereToBar", () => () => null);

import BoltDashboardPage from "@/src/features/bolt/pages/BoltDashboardPage";

describe("BoltDashboardPage", () => {
  it("renders Bolt live radar header", () => {
    render(<BoltDashboardPage />);

    expect(screen.getByText(/Live radar/i)).toBeInTheDocument();
  });
});
