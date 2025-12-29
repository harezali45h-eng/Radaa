import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DriverDashboardScreen from '../screens/driver/DriverDashboardScreen';
import DriverMapScreen from '../screens/driver/DriverMapScreen';
import type { DriverStackParamList } from './types';

const Stack = createNativeStackNavigator<DriverStackParamList>();

const DriverNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DriverDashboard"
        component={DriverDashboardScreen}
        options={{ title: 'Driver Dashboard' }}
      />
      <Stack.Screen
        name="DriverMap"
        component={DriverMapScreen}
        options={{ title: 'Driver Map' }}
      />
    </Stack.Navigator>
  );
};

export default DriverNavigator;
