import React, { useEffect, useState } from 'react';

import AuthNavigator, { type AuthenticatedUser } from './AuthNavigator';
import DriverNavigator from './DriverNavigator';
import PassengerNavigator from './PassengerNavigator';
import ErrorScreen from '../screens/common/ErrorScreen';
import LoadingScreen from '../screens/common/LoadingScreen';
import { ensureApiConfigured, setAuthToken } from '../config/api';

const RootNavigator: React.FC = () => {
  const [initializing, setInitializing] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        ensureApiConfigured();
        if (!cancelled) {
          setInitializing(false);
        }
      } catch (error: any) {
        const message =
          (error && typeof error.message === 'string' && error.message) ||
          'API base URL is not configured for the mobile app. Set EXPO_PUBLIC_API_BASE_URL, NEXT_PUBLIC_API_BASE_URL, or API_BASE_URL before building.';

        if (!cancelled) {
          setFatalError(message);
          setInitializing(false);
        }
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setAuthToken(user?.token);
  }, [user?.token]);

  const handleAuthenticated = (nextUser: AuthenticatedUser) => {
    setUser(nextUser);
  };

  if (fatalError) {
    return <ErrorScreen message={fatalError} />;
  }

  if (initializing) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthNavigator onAuthenticated={handleAuthenticated} />;
  }

  if (user.role === 'driver') {
    return <DriverNavigator />;
  }

  return <PassengerNavigator />;
};

export default RootNavigator;
