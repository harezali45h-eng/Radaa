import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PassengerHomeScreen from '../screens/passenger/PassengerHomeScreen';
import PassengerMapScreen from '../screens/passenger/PassengerMapScreen';
import type { PassengerStackParamList } from './types';

const Stack = createNativeStackNavigator<PassengerStackParamList>();

const PassengerNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PassengerHome"
        component={PassengerHomeScreen}
        options={{ title: 'Passenger Home' }}
      />
      <Stack.Screen
        name="PassengerMap"
        component={PassengerMapScreen}
        options={{ title: 'Passenger Map' }}
      />
    </Stack.Navigator>
  );
};

export default PassengerNavigator;
