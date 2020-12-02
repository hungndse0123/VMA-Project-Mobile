import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  AsyncStorage,
  LogBox,
  KeyboardAwareScrollView,
  Dimensions,
  Image
} from "react-native";
import { checkAuthState } from "./src/services/FireAuthHelper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator, DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import UserRepository from './src/repositories/UserRepository';
import ContributorNavigator from './src/navigation/ContributorNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import DriverNavigator from './src/navigation/DriverNavigator';
import SplashScreen from './src/screens/SplashScreen';
import Role from './src/screens/Role';
import { fcmService } from './src/services/FCMService'
import { localNotificationService } from './src/services/LocalNotificationService'


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const { height } = Dimensions.get('window');
const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fcmService.registerAppWithFCM()
    fcmService.register(onRegister, onNotification, onOpenNotification)
    localNotificationService.configure(onOpenNotification)

    function onRegister(token) {
      console.log("[App] onRegister: ", token)
      UserRepository.createClientRegistrationToken(token)
    }

    function onNotification(notify) {
      console.log("[App] onNotification: ", notify)
      const options = {
        soundName: 'default',
        playSound: true, //,
        // largeIcon: 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
        // smallIcon: 'ic_launcher' // add icon small for Android (Link: app/src/main/mipmap)
      }
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options
      )
    }

    function onOpenNotification(notify) {
      console.log("[App] onOpenNotification: ", notify)
      alert("REQUEST" + notify.id + ": " + notify.notificationType)
    }

    return () => {
      console.log("[App] unRegister")
      fcmService.unRegister()
      localNotificationService.unregister()
    }

  }, [])
  LogBox.ignoreAllLogs();
  checkAuthState()
    .then((user) => {
      console.log("checkOnAuthStateChanged =>", user);
      setUser(user);
      setIsLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setUser(null);
      setIsLoading(false);
    });

  const Loader = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>

    );
  };

  const Navigate = () => {
    return (
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName={
            // user ? role === "CONTRIBUTOR" ? "Contributor" : role === "DRIVER" ? "Driver" : "Splash" : "Auth"
            user ? "Role" : "Auth"
          }
        >
          <Drawer.Screen name="Auth" options={{ headerShown: false, }} component={AuthNavigator} />
          <Drawer.Screen name="Role" options={{ headerShown: false, }} component={Role} />
          <Drawer.Screen name="Driver" options={{ headerShown: false, }} component={DriverNavigator} />
          <Drawer.Screen name="Contributor" options={{ headerShown: false, }} component={ContributorNavigator} />
          <Drawer.Screen name="Splash" options={{ headerShown: false, }} component={SplashScreen} />
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
