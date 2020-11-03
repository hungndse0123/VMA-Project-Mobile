import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import { checkAuthState } from "./src/services/FireAuthHelper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator, DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';


import PhoneOTP from './src/screens/PhoneOTP';
import Login from './src/screens/Login';
import Role from './src/screens/Role';
import Overview from './src/screens/Overview';
import Profile from './src/screens/Profile';
import Service from './src/screens/Service';
import Requests from './src/screens/Requests';
import ContributorService from './src/screens/ContributorService';
import ContributorDriver from './src/screens/ContributorDriver';
import ContributorVehicle from './src/screens/ContributorVehicle';
import ContributorProfile from './src/screens/ContributorProfile';
import Icon from "react-native-vector-icons/Entypo";
import UserRepository from './src/repositories/UserRepository';
import ContributorNavigator from './src/navigation/ContributorNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import DriverNavigator from './src/navigation/DriverNavigator';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [test, setTest] = useState(null);

  // const getData = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('@ROLE')
  //     if (token !== null)
  //       await setTest(token)
  //   } catch (e) {
  //     // error reading value
  //   }
  // }
  // LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  checkAuthState()
    .then((user) => {
      console.log("checkOnAuthStateChanged =>", user);
      setUser(user);
      setRole("CONTRIBUTOR");
      //clearAllData();
      //setRole(_retrieveData());
      // AsyncStorage.getItem("@ROLE").then((response) => {
      //   setRole(response)
      // });
      // getData();
      //console.log(test);
      //setRole(test);
      setIsLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setUser(null);
      setIsLoading(false);
    });
  // UserRepository.getUserrole().then((response) => {
  //   //console.log(response);
  //   const result = Object.values(response.data.roleList);
  //   //setRole(result["0"].roleName);
  //   console.log(result);
  // })
  //   .catch((error) => {
  //     console.log(JSON.stringify(error) + "c")
  //   });


  const clearAllData = () => {
    AsyncStorage.getAllKeys()
      .then(keys => AsyncStorage.multiRemove(keys))
      .then(() => alert('success'));
  }
  const Loader = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  };
  const CustomDrawerContent = (props) => {
    const { state, ...rest } = props;
    const newState = { ...state };
    newState.routes = newState.routes.filter(
      (item) => item.name !== 'Login' && item.name !== 'PhoneOTP' && item.name !== 'PhoneOTP' && item.name !== 'Role',
    );

    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList state={newState} {...rest} />
      </DrawerContentScrollView>
    );
  };

  const Navigate = () => {
    return (

      <NavigationContainer>
        {/* <Drawer.Navigator
          initialRouteName={user ? "Service" : "Login"}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{ headerTitleAlign: "center" }}
        >
          <Drawer.Screen name="PhoneOTP" options={{ headerShown: false, }} component={PhoneOTP} />
          <Drawer.Screen name="Login" options={{ headerShown: false }} component={Login} />
          <Drawer.Screen name="Role" options={{ headerShown: false }} component={Role} />
          {
            role === "CONTRIBUTOR" ? (
              <>
                <Drawer.Screen name="Service" options={{ headerShown: false, drawerIcon: () => <Icon name="home" size={30} /> }} component={ContributorService} />
                <Drawer.Screen name="Profile" options={{ headerShown: false, drawerIcon: () => <Icon name="user" size={30} /> }} component={ContributorProfile} />

                <Drawer.Screen name="Assigned Driver" options={{ headerShown: false, drawerIcon: () => <Icon name="user" size={30} /> }} component={ContributorDriver} />

                <Drawer.Screen name="Contributor Vehicle" options={{ headerShown: false, drawerIcon: () => <Icon name="suitcase" size={30} /> }} component={ContributorVehicle} />
              </>
            )
              : role === "DRIVER" ?
                (
                  <>
                    <Drawer.Screen name="Service" options={{ headerShown: false, drawerIcon: () => <Icon name="home" size={30} /> }} component={Service} />
                    <Drawer.Screen name="Profile" options={{ headerShown: false, drawerIcon: () => <Icon name="user" size={30} /> }} component={Profile} />
                    <Drawer.Screen name="Requests" options={{ headerShown: false, drawerIcon: () => <Icon name="upload" size={30} /> }} component={Requests} />
                  </>
                ) : (<></>)
          }
        </Drawer.Navigator> */}
        <Drawer.Navigator
          initialRouteName={user ? role === "CONTRIBUTOR" ? "Contributor" : role === "DRIVER" ? "Driver" : (Contributor) : "Auth"}>
          <Drawer.Screen name="Auth" options={{ headerShown: false, }} component={AuthNavigator} />
          <Drawer.Screen name="Driver" options={{ headerShown: false, }} component={DriverNavigator} />
          <Drawer.Screen name="Contributor" options={{ headerShown: false, }} component={ContributorNavigator} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  };

  const CheckUser = () => {
    if (isLoading) {
      return <Loader />;
    } else {
      return <Navigate />;
    }
  };

  return (
    <CheckUser />
  );
};

export default App;


const styles = StyleSheet.create({});
