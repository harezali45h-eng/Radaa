import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  MatatuSwipeDeck,
  type SwipeMatatu,
} from "@/components/map/MatatuSwipeDeck";

describe("MatatuSwipeDeck", () => {
  it("shows empty state when there are no items", () => {
    render(<MatatuSwipeDeck items={[]} />);

    expect(
      screen.getByText(/no nearby matatus to show right now/i),
    ).toBeInTheDocument();
  });

  it("renders first matatu and advances on skip", () => {
    const items: SwipeMatatu[] = [
      { id: "1", plate: "KAA 123A" },
      { id: "2", plate: "KBB 456B" },
    ];

    render(<MatatuSwipeDeck items={items} />);

    expect(screen.getByText(/KAA 123A/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /skip/i }));

    expect(screen.getByText(/KBB 456B/i)).toBeInTheDocument();
  });
});
