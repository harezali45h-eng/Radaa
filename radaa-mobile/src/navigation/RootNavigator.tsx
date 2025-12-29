import React from 'react';
import { StyleSheet, Text } from 'react-native';

import ScreenContainer from '../components/ScreenContainer';

const RootNavigator: React.FC = () => {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Radaa mobile preview</Text>
      <Text style={styles.subtitle}>
        This build does not include the full Radaa experience (login, live rides,
        or driver dashboards). Please use the web app for production use.
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

export default RootNavigator;
