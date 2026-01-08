import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import * as Location from 'expo-location';

import { apiClient, ensureApiConfigured } from '../../config/api';
import {
  connectRealtime,
  emitPaxLocationUpdate,
  emitPaxOffline,
  emitPaxOnline,
} from '../../realtime/socket';
import MatatuGalleryModal from '../../components/MatatuGalleryModal';

const INITIAL_REGION: Region = {
  latitude: -1.286389,
  longitude: 36.817223,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const LOCATION_UPDATE_MIN_TIME_MS = 3000;
const LOCATION_UPDATE_MIN_DISTANCE_METERS = 20;

// Background presence scaffolding (future-only):
// - Today we only request foreground location permission and emit presence
//   while this screen is mounted and visible.
// - If we ever add background presence, we should:
//   - Use explicit background location permissions and OS-specific affordances.
//   - Add clear in-app explanations and settings for users.
//   - Carefully tune battery impact and rate limits.
// - This comment is documentation only; no background behavior is enabled.

type MatatuMarker = {
  id: string;
  latitude: number;
  longitude: number;
  plate?: string | null;
  route?: string | null;
  sacco?: string | null;
  mainPhotoUrl?: string | null;
};

const EARTH_RADIUS_METERS = 6371000;

const toRadians = (value: number): number => (value * Math.PI) / 180;

const computeDistanceMeters = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
};

const PassengerMapScreen: React.FC = () => {
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [matatus, setMatatus] = useState<MatatuMarker[]>([]);
  const [selectedMatatuId, setSelectedMatatuId] = useState<string | null>(null);

  const locationWatchRef = useRef<Location.LocationSubscription | null>(null);
  const lastEmitRef = useRef<number>(0);
  const lastEmitLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  const hasConnectedOnceRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const startLocationFlow = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('[PassengerMap] location permission not granted:', status);
          }
          return;
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (cancelled) {
          return;
        }

        const { latitude, longitude } = current.coords;

        setRegion((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));

        connectRealtime();
        emitPaxOnline({ lat: latitude, lng: longitude });
        lastEmitRef.current = Date.now();
        lastEmitLocationRef.current = { lat: latitude, lng: longitude };

        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (update) => {
            const { latitude: lat, longitude: lng } = update.coords;

            setRegion((prev) => ({
              ...prev,
              latitude: lat,
              longitude: lng,
            }));

            const now = Date.now();
            const lastTime = lastEmitRef.current || 0;
            const lastLocation = lastEmitLocationRef.current;

            let distance: number | null = null;
            if (lastLocation) {
              distance = computeDistanceMeters(
                lastLocation.lat,
                lastLocation.lng,
                lat,
                lng,
              );
            }

            const timeOk =
              !lastTime || now - lastTime >= LOCATION_UPDATE_MIN_TIME_MS;
            const distanceOk =
              distance == null || distance >= LOCATION_UPDATE_MIN_DISTANCE_METERS;

            if (timeOk && distanceOk) {
              emitPaxLocationUpdate({ lat, lng });
              lastEmitRef.current = now;
              lastEmitLocationRef.current = { lat, lng };
            } else if (__DEV__) {
              // eslint-disable-next-line no-console
              console.log('[PassengerMap] location update skipped', {
                reason:
                  !timeOk && !distanceOk
                    ? 'too soon and below distance threshold'
                    : !timeOk
                    ? 'too soon since last update'
                    : 'below distance threshold',
                timeSinceLastMs: lastTime ? now - lastTime : null,
                distanceMeters: distance,
              });
            }
          },
        );

        locationWatchRef.current = subscription;
      } catch (error) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log('[PassengerMap] location error', error);
        }
      }
    };

    startLocationFlow();

    return () => {
      cancelled = true;
      if (locationWatchRef.current) {
        locationWatchRef.current.remove();
        locationWatchRef.current = null;
      }
      emitPaxOffline();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadMatatus = async () => {
      try {
        ensureApiConfigured();
        const response = await apiClient.get('/map/markers');
        const raw = response.data as any;
        const payload =
          raw && typeof raw === 'object' && 'data' in raw ? (raw as any).data : raw;

        if (!Array.isArray(payload) || cancelled) {
          return;
        }

        const next: MatatuMarker[] = payload
          .map((item: any) => {
            if (!item || !item.location) return null;
            const { lat, lng } = item.location;
            if (typeof lat !== 'number' || typeof lng !== 'number') return null;

            return {
              id: String(item.id ?? item._id),
              latitude: lat,
              longitude: lng,
              plate: item.plate ?? null,
              route: item.route ?? null,
              sacco: item.sacco ?? null,
              mainPhotoUrl: item.mainPhotoUrl ?? null,
            } as MatatuMarker;
          })
          .filter((m): m is MatatuMarker => m != null);

        if (!cancelled) {
          setMatatus(next);
        }
      } catch (error) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log('[PassengerMap] failed to load matatus', error);
        }
      }
    };

    loadMatatus();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const s = connectRealtime();
    if (!s) {
      return undefined;
    }

    const handleConnect = () => {
      if (!hasConnectedOnceRef.current) {
        hasConnectedOnceRef.current = true;
        return;
      }

      const lastLocation = lastEmitLocationRef.current;
      if (lastLocation) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log(
            '[PassengerMap] socket reconnect, re-emitting pax:online with last location',
            lastLocation,
          );
        }
        emitPaxOnline(lastLocation);
        lastEmitRef.current = Date.now();
      } else {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log(
            '[PassengerMap] socket reconnect, emitting pax:online without location',
          );
        }
        emitPaxOnline();
        lastEmitRef.current = Date.now();
      }
    };

    s.on('connect', handleConnect);

    return () => {
      s.off('connect', handleConnect);
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {matatus.map((m) => {
          const label = m.plate || m.route || 'Matatu';
          return (
            <Marker
              key={m.id}
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              title={label}
              description={m.sacco || undefined}
              onPress={() => setSelectedMatatuId(m.id)}
            >
              <View style={styles.matatuMarker}>
                {m.mainPhotoUrl ? (
                  <Image
                    source={{ uri: m.mainPhotoUrl }}
                    style={styles.matatuMarkerImage}
                  />
                ) : (
                  <View style={styles.matatuMarkerFallback}>
                    <Text style={styles.matatuMarkerFallbackText}>{label}</Text>
                  </View>
                )}
              </View>
            </Marker>
          );
        })}
      </MapView>
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Map view for your Radaa trips</Text>
      </View>
      <MatatuGalleryModal
        visible={selectedMatatuId != null}
        matatuId={selectedMatatuId}
        onClose={() => setSelectedMatatuId(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  overlayText: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#ffffff',
    fontSize: 14,
  },
  matatuMarker: {
    width: 40,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matatuMarkerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  matatuMarkerFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  matatuMarkerFallbackText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
});

export default PassengerMapScreen;
