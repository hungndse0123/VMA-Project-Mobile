import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/stack';
import Analytics from '../screens/Analytic';
import Chat from '../screens/Chat';
import Services from '../screens/Services';
import Settings from '../screens/Settings';

const Tab  = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="Analytics" component={Analytics}></Tab.Screen>
      <Tab.Screen name="Chat" component={Chat}></Tab.Screen>
      <Tab.Screen name="Services" component={Services}></Tab.Screen>
      <Tab.Screen name="Settings" component={Settings}></Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;
