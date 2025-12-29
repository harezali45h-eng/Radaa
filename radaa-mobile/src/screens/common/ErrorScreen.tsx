import React from 'react';
import { Button, StyleSheet, Text } from 'react-native';

import ScreenContainer from '../../components/ScreenContainer';

export type ErrorScreenProps = {
  message?: string;
  onRetry?: () => void;
};

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.subtitle}>
        {message || 'An unexpected error occurred. Please try again later.'}
      </Text>
      {onRetry && <Button title="Retry" onPress={onRetry} />}
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
  subtitle: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ErrorScreen;
