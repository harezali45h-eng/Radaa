import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import type { AuthStackParamList } from './types';

export type AuthenticatedUser = {
  token: string;
  role?: string | null;
};

export type AuthNavigatorProps = {
  onAuthenticated: (user: AuthenticatedUser) => void;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onAuthenticated }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onAuthenticated={onAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
