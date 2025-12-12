import API from "@/lib/api";
import {
  suggestions,
  getRouteMatatus,
  getLive,
  interpolatePosition,
} from "@/src/features/bolt/api/boltApi";
import type { BoltBounds, BoltLatLng } from "@/src/features/bolt/types";

jest.mock("@/lib/api", () => {
  return {
    __esModule: true,
    default: {
      get: jest.fn(),
    },
  };
});

const mockedGet = API.get as unknown as jest.Mock;

describe("boltApi", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("returns empty suggestions for blank query", async () => {
    const res = await suggestions("   ");
    expect(res).toEqual({ suggestions: [], recent: [] });
    expect(mockedGet).not.toHaveBeenCalled();
  });

  it("unwraps suggestions and recent lists", async () => {
    mockedGet.mockResolvedValue({
      data: {
        success: true,
        data: {
          suggestions: [
            { id: "1", primaryText: "Route 1", type: "route" },
          ],
          recent: [{ id: "2", primaryText: "Recent", type: "recent" }],
        },
      },
    });

    const res = await suggestions("route");
    expect(mockedGet).toHaveBeenCalled();
    expect(res.suggestions).toHaveLength(1);
    expect(res.recent).toHaveLength(1);
  });

  it("returns empty array when route matatus payload is not an array", async () => {
    mockedGet.mockResolvedValue({ data: { success: true, data: null } });
    const res = await getRouteMatatus("route-id");
    expect(res).toEqual([]);
  });

  it("returns live matatus from unwrapped data array", async () => {
    const livePayload = [{ id: "m1", location: { lat: 1, lng: 2 } }];
    mockedGet.mockResolvedValue({ data: { success: true, data: livePayload } });

    const bounds: BoltBounds = {
      minLat: 0,
      maxLat: 2,
      minLng: 0,
      maxLng: 4,
    };

    const res = await getLive(bounds, 10);
    expect(mockedGet).toHaveBeenCalledWith("/bolt/live", {
      params: {
        bbox: "0,0,4,2",
        limit: 10,
      },
    });
    expect(res).toEqual(livePayload);
  });

  it("interpolates between two points", () => {
    const from: BoltLatLng = { lat: 0, lng: 0 };
    const to: BoltLatLng = { lat: 10, lng: 10 };
    const interp = interpolatePosition(from, to);

    const mid = interp(0.5);
    expect(mid.lat).toBeCloseTo(5);
    expect(mid.lng).toBeCloseTo(5);

    const start = interp(0);
    const end = interp(1);
    expect(start).toEqual(from);
    expect(end).toEqual(to);
  });
});
