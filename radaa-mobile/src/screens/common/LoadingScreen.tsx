import React from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import ScreenContainer from '../../components/ScreenContainer';

const LoadingScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <ActivityIndicator size="large" color="#000000" />
      <Text style={styles.text}>Loading, please wait...</Text>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  text: {
    marginTop: 16,
    fontSize: 14,
    color: '#555555',
  },
});

export default LoadingScreen;
