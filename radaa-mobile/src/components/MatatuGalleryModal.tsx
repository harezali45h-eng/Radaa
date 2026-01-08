import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import { apiClient, ensureApiConfigured } from '../config/api';

const { width } = Dimensions.get('window');

type MatatuGallerySectionKey = 'exterior' | 'interior' | 'cleanliness' | 'style' | 'crowd';

type MatatuGalleryPhoto = {
  id: string | null;
  url: string;
  caption?: string | null;
  category?: MatatuGallerySectionKey;
};

type MatatuIdentity = {
  id: string;
  plate?: string | null;
  numberPlate?: string | null;
  route?: string | null;
  sacco?: string | null;
  gallery?: Partial<Record<MatatuGallerySectionKey, MatatuGalleryPhoto[]>>;
};

type Props = {
  visible: boolean;
  matatuId: string | null;
  onClose: () => void;
};

const MatatuGalleryModal: React.FC<Props> = ({ visible, matatuId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MatatuIdentity | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!visible || !matatuId) {
        setData(null);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setData(null);

      try {
        ensureApiConfigured();
        const response = await apiClient.get(`/matatus/${matatuId}/identity`);
        const raw = response.data as any;
        const payload = raw && typeof raw === 'object' && 'data' in raw ? (raw as any).data : raw;

        if (!cancelled && payload && typeof payload === 'object') {
          setData(payload as MatatuIdentity);
        }
      } catch (err: any) {
        if (!cancelled) {
          const message =
            (err && typeof err.message === 'string' && err.message) ||
            'Unable to load matatu photos right now.';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [visible, matatuId]);

  const photos = useMemo(() => {
    if (!data || !data.gallery) return [] as MatatuGalleryPhoto[];

    const order: MatatuGallerySectionKey[] = [
      'exterior',
      'interior',
      'cleanliness',
      'style',
      'crowd',
    ];

    const result: MatatuGalleryPhoto[] = [];

    order.forEach((key) => {
      const items = data.gallery && data.gallery[key];
      if (Array.isArray(items)) {
        items.forEach((item) => {
          if (!item || !item.url) return;
          result.push({
            id: item.id ?? null,
            url: item.url,
            caption: (item as any).caption ?? null,
            category: key,
          });
        });
      }
    });

    return result;
  }, [data]);

  const title = useMemo(() => {
    if (!data) return 'Matatu';
    if (data.route) return data.route;
    if (data.plate) return data.plate;
    if (data.numberPlate) return data.numberPlate;
    return 'Matatu';
  }, [data]);

  const subtitle = useMemo(() => {
    if (!data) return '';
    if (data.sacco) return data.sacco;
    return '';
  }, [data]);

  const hasPhotos = photos.length > 0;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouchable} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>{title}</Text>
              {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={styles.centerContent}>
              <ActivityIndicator />
              <Text style={styles.statusText}>Loading photos…</Text>
            </View>
          )}

          {!loading && error && (
            <View style={styles.centerContent}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && !error && !hasPhotos && (
            <View style={styles.centerContent}>
              <Text style={styles.statusText}>No photos available for this matatu yet.</Text>
            </View>
          )}

          {!loading && !error && hasPhotos && (
            <FlatList
              data={photos}
              keyExtractor={(item, index) => item.id ?? `${index}-${item.url}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.photoCard}>
                  <Image source={{ uri: item.url }} style={styles.photo} resizeMode="cover" />
                  {!!item.caption && <Text style={styles.caption}>{item.caption}</Text>}
                  {!!item.category && (
                    <Text style={styles.categoryLabel}>{item.category.toUpperCase()}</Text>
                  )}
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#0b1120',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#9ca3af',
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  closeButtonText: {
    fontSize: 12,
    color: '#e5e7eb',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  statusText: {
    marginTop: 8,
    fontSize: 13,
    color: '#d1d5db',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 8,
    fontSize: 13,
    color: '#fecaca',
    textAlign: 'center',
  },
  photoCard: {
    width: width - 48,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#020617',
  },
  photo: {
    width: '100%',
    height: 220,
    backgroundColor: '#020617',
  },
  caption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#e5e7eb',
  },
  categoryLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15,23,42,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 10,
    color: '#e5e7eb',
  },
});

export default MatatuGalleryModal;
