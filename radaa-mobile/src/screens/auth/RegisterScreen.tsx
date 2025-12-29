import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenContainer from '../../components/ScreenContainer';
import type { AuthStackParamList } from '../../navigation/types';

export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<RegisterScreenProps> = () => {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subtitle}>
        This preview build does not support creating new Radaa accounts. Use the
        Radaa web dashboard to sign up and manage your profile.
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

export default RegisterScreen;
