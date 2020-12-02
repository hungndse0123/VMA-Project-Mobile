import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import Service from '../screens/Service';
import Profile from '../screens/Profile';
import PhoneOTP from '../screens/PhoneOTP';
import Login from '../screens/Login';
import Overview from '../screens/Overview';
import Requests from '../screens/Requests';
import Icon from '../components/Icon';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator initialRouteName="Service">
      <Drawer.Screen
        name="Service"
        component={Service}
        options={{
          drawerIcon: () => <Icon menuIcon size={30} />
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: () => <Icon menuIcon size={30} />
        }}
      />
    </Drawer.Navigator>
    // <Drawer.Navigator>
    //   <Drawer.Screen name="Overview" component={Overview}></Drawer.Screen>
    //   <Drawer.Screen name="Analytics" component={Analytics}></Drawer.Screen>
    //   <Drawer.Screen name="Chat" component={Chat}></Drawer.Screen>
    //   <Drawer.Screen name="Services" component={Services}></Drawer.Screen>
    //   <Drawer.Screen name="Settings" component={Settings}></Drawer.Screen>
    //   <Drawer.Screen name="Vehicles" component={Vehicles}></Drawer.Screen>
    // </Drawer.Navigator>
  );
};
export default DrawerNavigation;
