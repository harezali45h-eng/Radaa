import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

export type ScreenContainerProps = {
  children: ReactNode;
  style?: ViewStyle;
};

const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScreenContainer;
