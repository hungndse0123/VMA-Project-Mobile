import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  AsyncStorage,
  LogBox
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
  LogBox.ignoreAllLogs();
  checkAuthState()
    .then((user) => {
      console.log("checkOnAuthStateChanged =>", user);
      setUser(user);
      UserRepository.getUserrole()
        .then((response) => {
          setRole(response.data["roleList"][0]["roleName"]);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setUser(null);
          setIsLoading(false);
        })
      setIsLoading(false);
      //clearAllData();
      //setRole(_retrieveData());
      // AsyncStorage.getItem("@ROLE").then((response) => {
      //   setRole(response)
      // });
      // getData();
      //console.log(test);
      //setRole(test);      
    })
    .catch((error) => {
      console.log(error);
      setUser(null);
      setIsLoading(false);
    });
  // user ? UserRepository.getUserrole()
  //   .then((response) => {
  //     setRole(response.data["roleList"][1]["roleName"]);
  //     setIsLoading(false);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     setUser(null);
  //     setIsLoading(false);
  //   }) : null
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
        <Drawer.Navigator
          initialRouteName={user ? role === "CONTRIBUTOR" ? "Contributor" : role === "DRIVER" ? "Driver" : null : "Auth"}>
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
