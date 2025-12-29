import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenContainer from '../../components/ScreenContainer';
import type { AuthStackParamList } from '../../navigation/types';

export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = () => {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>
        This preview build does not include in-app login. Use the Radaa web
        dashboard for real rides and account management.
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

export default LoginScreen;
