import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Block from '../components/Block';

import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import ContributorService from '../screens/ContributorService';
import ContributorProfile from '../screens/ContributorProfile';
import ContributorDriver from '../screens/ContributorDriver';
import ContributorVehicle from '../screens/ContributorVehicle';
import Overview from '../screens/Overview';
import Requests from '../screens/Requests';
import DriverDetail from '../screens/ContributorDriverDetail';
import VehicleDetail from '../screens/ContributorVehicleDetail';
import RequestMenu from '../screens/ContributorRequestMenu';
import RequestType from '../screens/ContributorRequestType';
import DocumentRequest from '../screens/ContributorDocumentRequest';
import RecentRequests from '../screens/RecentRequests';
import ContributorVehicleRequest from '../screens/ContributorVehicleRequest';
import Icon from "react-native-vector-icons/Entypo";
import { signOutUser } from "../services/FireAuthHelper";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
    const signOut = (uid) => {
        signOutUser()
            .then(() => {
                updateStatus(uid);
                BackHandler.exitApp();
            })
            .catch((error) => {
                alert(error);
            });
    };
    const CustomDrawerContent = (props) => {
        const { state, ...rest } = props;
        const newState = { ...state };
        newState.routes = newState.routes.filter(
            (item) => item.name !== 'ContributorVehicleRequest' && item.name !== 'Role' && item.name !== 'DriverDetail' && item.name !== 'VehicleDetail' && item.name !== 'RequestType' && item.name !== 'DocumentRequest' && item.name !== 'RecentRequests',
        );

        return (
            <DrawerContentScrollView {...props}>
                <Block center>
                    <Image
                        source={require('../assets/images/Base/Logo.png')}
                        style={{ height: 70, width: 102 }}
                    />
                </Block>
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
            <Drawer.Screen name="Overview" options={{ headerShown: false, drawerIcon: () => <Icon name="home" size={30} /> }} component={Overview} />
            <Drawer.Screen name="Service" options={{ headerShown: false, drawerIcon: () => <Icon name="home" size={30} /> }} component={ContributorService} />
            <Drawer.Screen name="Profile" options={{ headerShown: false, drawerIcon: () => <Icon name="user" size={30} /> }} component={ContributorProfile} />

            <Drawer.Screen name="Assigned Driver" options={{ drawerIcon: () => <Icon name="user" size={30} /> }} component={ContributorDriver} />

            <Drawer.Screen name="Contributor Vehicle" options={{ headerShown: false, drawerIcon: () => <Icon name="suitcase" size={30} /> }} component={ContributorVehicle} />
            <Drawer.Screen name="DriverDetail" options={{ headerShown: false, drawerIcon: () => <Icon name="upload" size={30} /> }} component={DriverDetail} />
            <Drawer.Screen name="VehicleDetail" options={{ headerShown: false, drawerIcon: () => <Icon name="upload" size={30} /> }} component={VehicleDetail} />
            <Drawer.Screen name="Request Menu" options={{ headerShown: false, drawerIcon: () => <Icon name="upload" size={30} /> }} component={RequestMenu} />
            <Drawer.Screen name="RequestType" options={{ headerShown: false, drawerIcon: () => <Icon name="upload" size={30} /> }} component={RequestType} />
            <Drawer.Screen name="DocumentRequest" options={{ headerShown: false, drawerIcon: () => <Icon name="upload" size={30} /> }} component={DocumentRequest} />
            <Drawer.Screen name="RecentRequests" options={{ headerShown: false, drawerIcon: () => <Icon name="upload" size={30} /> }} component={RecentRequests} />
            <Drawer.Screen name="ContributorVehicleRequest" options={{ headerShown: false, drawerIcon: () => <Icon name="upload" size={30} /> }} component={ContributorVehicleRequest} />
        </Drawer.Navigator>
    );
};
export default DrawerNavigation;
