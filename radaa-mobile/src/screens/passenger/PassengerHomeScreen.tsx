import React from 'react';
import { StyleSheet, Text } from 'react-native';

import ScreenContainer from '../../components/ScreenContainer';

const PassengerHomeScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Passenger Home</Text>
      <Text style={styles.subtitle}>
        Passenger ride requests, history, and shortcuts are not available in
        this mobile preview build. Use the Radaa web dashboard for the full
        experience.
      </Text>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default PassengerHomeScreen;
