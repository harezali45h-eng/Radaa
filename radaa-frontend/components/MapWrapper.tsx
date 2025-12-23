"use client";

import type { CSSProperties } from "react";
import type { LatLng, MatatuLike } from "@/lib/map/markerHelpers";
import MapContainer from "@/components/map/MapContainer";
import GoogleMapContainer from "@/components/map/GoogleMapContainer";

interface PassengerPoint {
  id: string;
  location: LatLng;
}

interface Matatu extends MatatuLike {
  id: string;
  status?: string;
  location?: LatLng | null;
  isTracked?: boolean;
}

export interface MapWrapperProps {
  matatus: Matatu[];
  passengers: PassengerPoint[];
  userLocation: LatLng | null;
  displayPositions: Record<string, LatLng>;
  project: (location: LatLng | null | undefined) => CSSProperties;
  onCenterOnMe: () => void;
  onSelectMatatu: (id: string) => void;
  isLoading: boolean;
  hasAnyLocation: boolean;
  driverMode?: boolean;
  showCenterOnMe?: boolean;
  routePath?: LatLng[];
  heatmapPoints?: LatLng[];
  heatmapEnabled?: boolean;
  routeConfidence?: "active_reliable" | "moving_slow" | "uncertain" | null;
  onMapClick?: (location: LatLng) => void;
}

const rawKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const GOOGLE_MAPS_ENABLED =
  !!rawKey && !rawKey.toLowerCase().includes("your-google-maps-api-key");

export default function MapWrapper(props: MapWrapperProps) {
  if (GOOGLE_MAPS_ENABLED) {
    return (
      <GoogleMapContainer
        matatus={props.matatus}
        passengers={props.passengers}
        userLocation={props.userLocation}
        onCenterOnMe={props.onCenterOnMe}
        onSelectMatatu={props.onSelectMatatu}
        isLoading={props.isLoading}
        hasAnyLocation={props.hasAnyLocation}
        driverMode={props.driverMode}
        mode={props.driverMode ? "driver" : "user"}
        showCenterOnMe={props.showCenterOnMe}
        routePath={props.routePath}
        routeConfidence={props.routeConfidence}
        heatmapPoints={props.heatmapPoints}
        heatmapEnabled={props.heatmapEnabled}
        onMapClick={props.onMapClick}
      />
    );
  }

  return (
    <MapContainer
      matatus={props.matatus}
      passengers={props.passengers}
      userLocation={props.userLocation}
      displayPositions={props.displayPositions}
      project={props.project}
      onCenterOnMe={props.onCenterOnMe}
      onSelectMatatu={props.onSelectMatatu}
      isLoading={props.isLoading}
      hasAnyLocation={props.hasAnyLocation}
      driverMode={props.driverMode}
      showCenterOnMe={props.showCenterOnMe}
      routePath={props.routePath}
      routeConfidence={props.routeConfidence}
      heatmapPoints={props.heatmapPoints}
      heatmapEnabled={props.heatmapEnabled}
      onMapClick={props.onMapClick}
    />
  );
}
