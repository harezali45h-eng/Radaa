import React from 'react';
import { StyleSheet, Text } from 'react-native';

import ScreenContainer from '../../components/ScreenContainer';

const DriverDashboardScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Driver Dashboard</Text>
      <Text style={styles.subtitle}>
        Use the Radaa driver tools to manage live rides, earnings, and driver
        status. Some advanced management features are available on the Radaa
        web dashboard.
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

export default DriverDashboardScreen;
