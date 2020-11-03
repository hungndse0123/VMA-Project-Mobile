import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import ContributorService from '../screens/ContributorService';
import ContributorProfile from '../screens/ContributorProfile';
import ContributorDriver from '../screens/ContributorDriver';
import ContributorVehicle from '../screens/ContributorVehicle';
import Overview from '../screens/Overview';
import Requests from '../screens/Requests';
import Icon from "react-native-vector-icons/Entypo";

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
            initialRouteName="Service"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{ headerTitleAlign: "center" }}
        >
            <Drawer.Screen name="Service" options={{ headerShown: false, drawerIcon: () => <Icon name="home" size={30} /> }} component={ContributorService} />
            <Drawer.Screen name="Profile" options={{ headerShown: false, drawerIcon: () => <Icon name="user" size={30} /> }} component={ContributorProfile} />

            <Drawer.Screen name="Assigned Driver" options={{ headerShown: false, drawerIcon: () => <Icon name="user" size={30} /> }} component={ContributorDriver} />

            <Drawer.Screen name="Contributor Vehicle" options={{ headerShown: false, drawerIcon: () => <Icon name="suitcase" size={30} /> }} component={ContributorVehicle} />
        </Drawer.Navigator>
    );
};
export default DrawerNavigation;
