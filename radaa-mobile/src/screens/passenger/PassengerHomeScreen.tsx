import React from 'react';
import { StyleSheet, Text } from 'react-native';

import ScreenContainer from '../../components/ScreenContainer';

const PassengerHomeScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Passenger Home</Text>
      <Text style={styles.subtitle}>
        View and manage your trips with Radaa. For detailed ride history and
        additional account tools, you can also use the Radaa web dashboard.
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
