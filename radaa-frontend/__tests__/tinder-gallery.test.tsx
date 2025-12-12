import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TinderGallery from "@/src/features/bolt/components/TinderGallery";
import type { BoltMatatuProfile } from "@/src/features/bolt/types";

const items: BoltMatatuProfile[] = [
  {
    id: "1",
    plate: "KAA 123A",
    sacco: "Alpha Sacco",
    route: "Route 1",
    speedKph: 20,
    bearing: 45,
    location: { lat: 0, lng: 0 },
    lastUpdated: null,
    photos: null,
  },
  {
    id: "2",
    plate: "KBB 456B",
    sacco: "Beta Sacco",
    route: "Route 2",
    speedKph: 25,
    bearing: 90,
    location: { lat: 1, lng: 1 },
    lastUpdated: null,
    photos: null,
  },
];

describe("TinderGallery", () => {
  it("shows empty state when there are no items", () => {
    render(<TinderGallery items={[]} />);
    expect(
      screen.getByText(/no nearby matatus to show right now/i),
    ).toBeInTheDocument();
  });

  it("renders first matatu and advances on Skip", () => {
    render(<TinderGallery items={items} />);

    expect(screen.getAllByText(/Route 1/i)[0]).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Skip/i }));

    expect(screen.getAllByText(/Route 2/i)[0]).toBeInTheDocument();
  });

  it("calls onOpenOnMap when Open on map clicked", () => {
    const handleOpen = jest.fn();
    render(<TinderGallery items={items} onOpenOnMap={handleOpen} />);

    fireEvent.click(screen.getByRole("button", { name: /Open on map/i }));

    expect(handleOpen).toHaveBeenCalledWith("1");
  });
});
