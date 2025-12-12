export interface BoltLatLng {
  lat: number;
  lng: number;
}

export type BoltSuggestionType =
  | "route"
  | "recent"
  | "place"
  | "live_stop";

export interface BoltSuggestion {
  id: string;
  primaryText: string;
  secondaryText?: string;
  type: BoltSuggestionType;
  location?: BoltLatLng | null;
  routeId?: string | null;
}

export interface BoltLiveMatatu {
  id: string;
  plate?: string;
  numberPlate?: string;
  sacco?: string | null;
  route?: string | null;
  speedKph?: number | null;
  bearing?: number | null;
  location: BoltLatLng | null;
  lastUpdated?: string | null;
}

export interface BoltMatatuProfile extends BoltLiveMatatu {
  photos?: string[] | null;
}

export interface BoltBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}
