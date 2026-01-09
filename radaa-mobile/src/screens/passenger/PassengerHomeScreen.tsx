import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import ScreenContainer from '../../components/ScreenContainer';
import { apiClient, ensureApiConfigured } from '../../config/api';

type PassengerRideSummary = {
  id: string;
  status: string;
  createdAt?: string | null;
};

const PassengerHomeScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rides, setRides] = useState<PassengerRideSummary[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadRides = async () => {
      setLoading(true);
      setError(null);

      try {
        ensureApiConfigured();

        const profileResponse = await apiClient.get('/auth/profile');
        const profile = profileResponse.data as any;
        const userId = profile && (profile._id || profile.id);

        if (!userId) {
          throw new Error('Unable to determine current user profile.');
        }

        const ridesResponse = await apiClient.get(`/rides/user/${userId}`);
        const raw = ridesResponse.data as any;
        const payload =
          raw && typeof raw === 'object' && 'data' in raw ? (raw as any).data : raw;

        if (!Array.isArray(payload)) {
          if (!cancelled) {
            setRides([]);
          }
          return;
        }

        if (cancelled) {
          return;
        }

        const activeStatuses = new Set(['pending', 'assigned', 'ongoing']);

        const next: PassengerRideSummary[] = payload
          .filter((item: any) => {
            if (!item || !item.status) return false;
            const status = String(item.status || '').toLowerCase();
            return activeStatuses.has(status);
          })
          .map((item: any) => {
            const createdRaw = (item as any).createdAt;
            let createdAt: string | null = null;

            if (typeof createdRaw === 'string') {
              createdAt = createdRaw;
            } else if (createdRaw instanceof Date) {
              createdAt = createdRaw.toISOString();
            }

            return {
              id: String(item._id ?? item.id),
              status: String(item.status || 'unknown'),
              createdAt,
            } as PassengerRideSummary;
          });

        if (!cancelled) {
          setRides(next);
        }
      } catch (err: any) {
        if (cancelled) {
          return;
        }

        const maybeResponse = err?.response?.data as any;
        const message =
          (maybeResponse &&
            typeof maybeResponse === 'object' &&
            typeof maybeResponse.message === 'string' &&
            maybeResponse.message) ||
          (typeof err?.message === 'string' && err.message) ||
          'Unable to load your rides right now. Please try again later.';

        setError(message);
        setRides([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRides();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasActiveRides = rides.length > 0;

  return (
    <ScreenContainer>
      <Text style={styles.title}>Your rides</Text>

      {loading && !error && (
        <View style={styles.stateContainer}>
          <ActivityIndicator />
          <Text style={styles.stateText}>Loading your active rides...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.stateContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && !hasActiveRides && (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>No active rides yet.</Text>
        </View>
      )}

      {!loading && !error && hasActiveRides && (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {rides.map((ride) => (
            <View key={ride.id} style={styles.rideCard}>
              <Text style={styles.ridePrimaryText}>Ride status: {ride.status}</Text>
              {ride.createdAt && (
                <Text style={styles.rideSecondaryText}>Created at: {ride.createdAt}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  stateContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  stateText: {
    marginTop: 8,
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#cc0000',
    textAlign: 'center',
  },
  list: {
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  rideCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  ridePrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rideSecondaryText: {
    fontSize: 13,
    color: '#555555',
  },
});

export default PassengerHomeScreen;
