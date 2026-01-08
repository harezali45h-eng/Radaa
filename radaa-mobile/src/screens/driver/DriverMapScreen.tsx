import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import * as Location from 'expo-location';

import {
  connectRealtime,
  onPaxLocationUpdate,
  onPaxOffline,
  onPaxOnline,
  onPaxPresenceSnapshot,
} from '../../realtime/socket';

const INITIAL_REGION: Region = {
  latitude: -1.286389,
  longitude: 36.817223,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

type PaxMarker = {
  passengerId: string;
  latitude: number;
  longitude: number;
};

const DriverMapScreen: React.FC = () => {
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [paxMarkers, setPaxMarkers] = useState<Record<string, PaxMarker>>({});

  useEffect(() => {
    let cancelled = false;

    const centerOnDriver = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('[DriverMap] location permission not granted:', status);
          }
          return;
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (cancelled) return;

        const { latitude, longitude } = current.coords;

        setRegion((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
      } catch (error) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log('[DriverMap] location error', error);
        }
      }
    };

    centerOnDriver();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    connectRealtime();

    const applySnapshot = (payload: { entries?: { passengerId: string; location: { lat: number; lng: number } | null }[] }) => {
      const entries = Array.isArray(payload.entries) ? payload.entries : [];
      const next: Record<string, PaxMarker> = {};

      entries.forEach((entry) => {
        if (!entry || !entry.passengerId || !entry.location) return;
        const { lat, lng } = entry.location;
        if (typeof lat !== 'number' || typeof lng !== 'number') return;

        next[entry.passengerId] = {
          passengerId: entry.passengerId,
          latitude: lat,
          longitude: lng,
        };
      });

      setPaxMarkers(next);
    };

    const upsertFromEvent = (payload: { passengerId: string; location?: { lat: number; lng: number } | null }) => {
      if (!payload || !payload.passengerId || !payload.location) return;
      const { lat, lng } = payload.location;
      if (typeof lat !== 'number' || typeof lng !== 'number') return;

      setPaxMarkers((prev) => ({
        ...prev,
        [payload.passengerId]: {
          passengerId: payload.passengerId,
          latitude: lat,
          longitude: lng,
        },
      }));
    };

    const removeFromEvent = (payload: { passengerId: string }) => {
      if (!payload || !payload.passengerId) return;
      setPaxMarkers((prev) => {
        const next = { ...prev };
        delete next[payload.passengerId];
        return next;
      });
    };

    const offSnapshot = onPaxPresenceSnapshot(applySnapshot);
    const offOnline = onPaxOnline(upsertFromEvent);
    const offLocation = onPaxLocationUpdate(upsertFromEvent);
    const offOffline = onPaxOffline(removeFromEvent);

    return () => {
      offSnapshot();
      offOnline();
      offLocation();
      offOffline();
    };
  }, []);

  const paxList = Object.values(paxMarkers);

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {paxList.map((pax) => (
          <Marker
            key={pax.passengerId}
            coordinate={{ latitude: pax.latitude, longitude: pax.longitude }}
            title="Passenger"
            description="Live passenger waiting here"
          >
            <View style={styles.paxMarkerOuter}>
              <View style={styles.paxMarkerInner} />
            </View>
          </Marker>
        ))}
      </MapView>
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Live passenger map for drivers</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {paxList.length === 1
              ? '1 passenger nearby'
              : `${paxList.length} passengers nearby`}
          </Text>
        </View>
      </View>
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
  badge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  paxMarkerOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,153,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paxMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0099ff',
  },
});

export default DriverMapScreen;
