import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PassengerNavigator from './PassengerNavigator';
import DriverNavigator from './DriverNavigator';

const Tab = createBottomTabNavigator();

const MainTabsNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Passenger"
        component={PassengerNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Driver"
        component={DriverNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default MainTabsNavigator;
