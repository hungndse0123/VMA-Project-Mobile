import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Forgot from '../screens/Forgot';
import Overview from '../screens/Overview';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Register" component={Register}></Stack.Screen>
      <Stack.Screen name="Login" component={Login}></Stack.Screen>
      <Stack.Screen name="Overview" component={Overview}></Stack.Screen>
      <Stack.Screen name="Forgot" component={Forgot}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default StackNavigator;
