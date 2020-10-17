import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {createDrawerNavigator} from '@react-navigation/drawer';
import Overview from '../screens/Overview';
import Analytics from '../screens/Analytics';
import Chat from '../screens/Chat';
import Services from '../screens/Services';
import Vehicles from '../screens/Vehicles';
import Settings from '../screens/Settings';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Overview" component={Overview}></Drawer.Screen>
      <Drawer.Screen name="Analytics" component={Analytics}></Drawer.Screen>
      <Drawer.Screen name="Chat" component={Chat}></Drawer.Screen>
      <Drawer.Screen name="Services" component={Services}></Drawer.Screen>
      <Drawer.Screen name="Settings" component={Settings}></Drawer.Screen>
      <Drawer.Screen name="Vehicles" component={Vehicles}></Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
