import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as {
  socketUrl?: string;
};

const RAW_SOCKET_URL = extra.socketUrl;
const SOCKET_URL = (RAW_SOCKET_URL ?? '').replace(/\/+$/, '');
const SOCKET_NAMESPACE = '/realtime';

let socket: Socket | null = null;
let hasWarnedMissingUrl = false;
let authToken: string | null = null;

const log = (...args: any[]) => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[realtime]', ...args);
  }
};

export const setRealtimeAuthToken = (token?: string | null) => {
  authToken = token || null;
  if (socket) {
    try {
      socket.disconnect();
    } catch {
      // ignore
    }
    socket = null;
  }
};

const buildSocketUrl = () => {
  if (!SOCKET_URL) return '';
  return `${SOCKET_URL}${SOCKET_NAMESPACE}`;
};

const ensureSocket = (): Socket | null => {
  if (!SOCKET_URL) {
    if (!hasWarnedMissingUrl) {
      hasWarnedMissingUrl = true;
      log('EXPO_PUBLIC_SOCKET_URL is not configured; realtime disabled');
    }
    return null;
  }

  if (socket) return socket;

  const url = buildSocketUrl();

  try {
    socket = io(url, {
      path: '/socket.io',
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 10000,
      timeout: 10000,
      auth: authToken ? { token: authToken } : undefined,
    });

    socket.on('connect', () => {
      log('connected', socket && socket.id);
    });

    socket.on('disconnect', (reason) => {
      log('disconnected', reason);
    });

    socket.on('connect_error', (error) => {
      log('connect_error', error?.message || String(error));
    });
  } catch (error) {
    log('failed to initialize socket', error);
    socket = null;
  }

  return socket;
};

export const connectRealtime = (): Socket | null => {
  return ensureSocket();
};

const emitEvent = (event: string, payload?: any) => {
  const s = ensureSocket();
  if (!s) return;
  try {
    if (payload !== undefined) {
      s.emit(event, payload);
    } else {
      s.emit(event);
    }
    log('emit', event, payload);
  } catch (error) {
    log('emit error', event, error);
  }
};

export type PaxLocation = {
  lat: number;
  lng: number;
};

export const emitPaxOnline = (location?: PaxLocation | null) => {
  const payload = location ? { location } : {};
  emitEvent('pax:online', payload);
};

export const emitPaxLocationUpdate = (location: PaxLocation) => {
  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return;
  }
  emitEvent('pax:location:update', { location });
};

export const emitPaxOffline = () => {
  emitEvent('pax:offline');
};

type PaxPresenceEntry = {
  passengerId: string;
  location: PaxLocation | null;
  updatedAt: string;
};

type PaxPresenceSnapshotPayload = {
  entries?: PaxPresenceEntry[];
};

export const onPaxPresenceSnapshot = (
  callback: (payload: PaxPresenceSnapshotPayload) => void,
): (() => void) => {
  const s = ensureSocket();
  if (!s) return () => {};

  const handler = (payload: PaxPresenceSnapshotPayload) => {
    log('recv pax:presence:snapshot', payload);
    callback(payload || { entries: [] });
  };

  s.on('pax:presence:snapshot', handler);

  return () => {
    s.off('pax:presence:snapshot', handler);
  };
};

type PaxPresenceEventPayload = {
  passengerId: string;
  location?: PaxLocation | null;
  updatedAt?: string;
};

export const onPaxOnline = (
  callback: (payload: PaxPresenceEventPayload) => void,
): (() => void) => {
  const s = ensureSocket();
  if (!s) return () => {};

  const handler = (payload: PaxPresenceEventPayload) => {
    log('recv pax:online', payload);
    callback(payload);
  };

  s.on('pax:online', handler);

  return () => {
    s.off('pax:online', handler);
  };
};

export const onPaxLocationUpdate = (
  callback: (payload: PaxPresenceEventPayload) => void,
): (() => void) => {
  const s = ensureSocket();
  if (!s) return () => {};

  const handler = (payload: PaxPresenceEventPayload) => {
    log('recv pax:location:update', payload);
    callback(payload);
  };

  s.on('pax:location:update', handler);

  return () => {
    s.off('pax:location:update', handler);
  };
};

export const onPaxOffline = (
  callback: (payload: PaxPresenceEventPayload) => void,
): (() => void) => {
  const s = ensureSocket();
  if (!s) return () => {};

  const handler = (payload: PaxPresenceEventPayload) => {
    log('recv pax:offline', payload);
    callback(payload);
  };

  s.on('pax:offline', handler);

  return () => {
    s.off('pax:offline', handler);
  };
};

export const disconnectRealtime = () => {
  if (socket) {
    try {
      socket.disconnect();
    } catch {
      // ignore
    }
    socket = null;
  }
};
