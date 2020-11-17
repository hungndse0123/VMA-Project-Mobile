import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Profile from '../screens/Profile';
import Service from '../screens/Service';
import ContributorVehicle from '../screens/ContributorVehicle';
import Overview from '../screens/Overview';
import Requests from '../screens/Requests';
import Trips from '../screens/Trips';
import TripDetail from '../screens/TripDetail';
import CreateRequest from '../screens/CreateRequest';

import Icon from "react-native-vector-icons/Entypo";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
    const CustomDrawerContent = (props) => {
        const { state, ...rest } = props;
        const newState = { ...state };
        newState.routes = newState.routes.filter(
            (item) => item.name !== 'Login' && item.name !== 'PhoneOTP' && item.name !== 'Role' && item.name !== 'Trips' && item.name !== 'TripDetail' && item.name !== 'CreateRequest',
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
            <Drawer.Screen name="Service" options={{ headerShown: false, drawerIcon: () => <Icon name="home" size={30} /> }} component={Service} />
            <Drawer.Screen name="Profile" options={{ headerShown: false, drawerIcon: () => <Icon name="user" size={30} /> }} component={Profile} />
            <Drawer.Screen name="Requests" options={{ headerShown: false, drawerIcon: () => <Icon name="upload" size={30} /> }} component={Requests} />
            <Drawer.Screen name="Trips" options={{ headerShown: false, drawerIcon: () => <Icon name="upload" size={30} /> }} component={Trips} />
            <Drawer.Screen name="TripDetail" options={{ headerShown: false, drawerIcon: () => <Icon name="upload" size={30} /> }} component={TripDetail} />
            <Drawer.Screen name="CreateRequest" options={{ headerShown: false, drawerIcon: () => <Icon name="home" size={30} /> }} component={CreateRequest} />
        </Drawer.Navigator>
    );
};
export default DrawerNavigation;
