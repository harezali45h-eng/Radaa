import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenContainer from '../../components/ScreenContainer';
import type { AuthStackParamList } from '../../navigation/types';
import type { AuthenticatedUser } from '../../navigation/AuthNavigator';
import { apiClient, ensureApiConfigured } from '../../config/api';

export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'> & {
  onAuthenticated: (user: AuthenticatedUser) => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      ensureApiConfigured();

      const response = await apiClient.post('/auth/login', {
        email: email.trim(),
        password,
      });

      const data: any = response.data;
      const payload =
        data && typeof data === 'object' && 'data' in data ? (data as any).data : data;

      if (!payload || typeof payload.token !== 'string') {
        const message = 'Unexpected login response from the server.';
        setError(message);
        Alert.alert('Login failed', message);
        return;
      }

      const nextUser: AuthenticatedUser = {
        token: payload.token,
        role: (payload as any).role ?? null,
      };

      onAuthenticated(nextUser);
    } catch (err: any) {
      console.error('Login error', err);
      const maybeResponse = err?.response?.data as any;
      const message =
        (maybeResponse &&
          typeof maybeResponse === 'object' &&
          typeof maybeResponse.message === 'string' &&
          maybeResponse.message) ||
        (typeof err?.message === 'string' && err.message) ||
        'Login failed. Please check your details and try again.';

      setError(message);
      Alert.alert('Login failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = email.trim().length > 0 && password.length > 0 && !submitting;

  return (
    <ScreenContainer>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Sign in to your Radaa account to continue.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title={submitting ? 'Signing in…' : 'Sign in'}
        onPress={handleLogin}
        disabled={!canSubmit}
      />
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
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  error: {
    fontSize: 14,
    color: '#cc0000',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default LoginScreen;
