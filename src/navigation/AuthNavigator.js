import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import PhoneOTP from '../screens/PhoneOTP';
import Login from '../screens/Login';
import Role from '../screens/Role';
import Overview from '../screens/Overview';
import Requests from '../screens/Requests';
import Icon from '../components/Icon';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
    const CustomDrawerContent = (props) => {
        const { state, ...rest } = props;
        const newState = { ...state };
        newState.routes = newState.routes.filter(
            (item) => item.name !== 'Login' && item.name !== 'PhoneOTP' && item.name !== 'Role',
        );

        return (
            <DrawerContentScrollView {...props}>
                <DrawerItemList state={newState} {...rest} />
            </DrawerContentScrollView>
        );
    };
    return (
        <Drawer.Navigator
            initialRouteName="Login"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{ headerTitleAlign: "center" }}
        >
            <Drawer.Screen name="PhoneOTP" options={{ headerShown: false, }} component={PhoneOTP} />
            <Drawer.Screen name="Login" options={{ headerShown: false }} component={Login} />
            <Drawer.Screen name="Role" options={{ headerShown: false }} component={Role} />
        </Drawer.Navigator>
    );
};
export default DrawerNavigation;
