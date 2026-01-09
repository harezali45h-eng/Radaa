import React, { useEffect, useState } from 'react';

import AuthNavigator, { type AuthenticatedUser } from './AuthNavigator';
import DriverNavigator from './DriverNavigator';
import PassengerNavigator from './PassengerNavigator';
import ErrorScreen from '../screens/common/ErrorScreen';
import { ensureApiConfigured, setAuthToken } from '../config/api';
import { setRealtimeAuthToken } from '../realtime/socket';

type RootErrorBoundaryState = {
  hasError: boolean;
  error: unknown | null;
};

class RootErrorBoundary extends React.Component<{ children?: React.ReactNode }, RootErrorBoundaryState> {
  constructor(props: { children?: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: unknown): RootErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  // In production we surface fatal errors via the UI instead of crashing.
  componentDidCatch(error: unknown, _errorInfo: unknown) {
    // No-op: we intentionally avoid relying on native logging or dev tools.
  }

  render() {
    if (this.state.hasError) {
      const rawError = this.state.error;

      let message = 'A fatal application error occurred.';

      if (typeof rawError === 'string') {
        message = rawError;
      } else if (rawError && typeof (rawError as any).message === 'string') {
        message = (rawError as any).message;
      } else if (rawError != null) {
        try {
          message = JSON.stringify(rawError);
        } catch {
          message = String(rawError);
        }
      }

      return <ErrorScreen message={message} />;
    }

    return this.props.children as React.ReactElement;
  }
}

const RootNavigatorInner: React.FC = () => {
  ensureApiConfigured();

  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    setAuthToken(user?.token);
    setRealtimeAuthToken(user?.token ?? null);
  }, [user?.token]);

  const handleAuthenticated = (nextUser: AuthenticatedUser) => {
    setUser(nextUser);
  };

  if (!user) {
    return <AuthNavigator onAuthenticated={handleAuthenticated} />;
  }

  if (user.role === 'driver') {
    return <DriverNavigator />;
  }

  return <PassengerNavigator />;
};

const RootNavigator: React.FC = () => {
  return (
    <RootErrorBoundary>
      <RootNavigatorInner />
    </RootErrorBoundary>
  );
};

export default RootNavigator;
