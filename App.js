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
import { fcmService } from './src/services/FCMService';
import { localNotificationService } from './src/services/LocalNotificationService';
import Geolocation from '@react-native-community/geolocation';
import firebase from "@react-native-firebase/app";
import firestore from '@react-native-firebase/firestore';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const { height } = Dimensions.get('window');
const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [watchID, setWatchID] = useState(0);
  useEffect(() => {
    checkAuthState()
      .then((user) => {
        console.log("checkOnAuthStateChanged =>", user);
        setUser(user);
        fcmService.registerAppWithFCM()
        fcmService.register(onRegister, onNotification, onOpenNotification)
        localNotificationService.configure(onOpenNotification)
        watchUserPosition(user.uid)
        //watchUserPosition(user.uid)
        setIsLoading(false);
        // return () => {
        //   console.log("[App] unRegister")
        //   fcmService.unRegister()
        //   localNotificationService.unregister()
        //   Geolocation.clearWatch(watchID);
        //   Geolocation.stopObserving();
        //   console.log("position end!")
        // }
      })
      .catch((error) => {
        console.log(error);
        setUser(null);
        setIsLoading(false);
      });


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
      //alert("REQUEST" + notify.id + ": " + notify.notificationType)
    }

    return () => {
      console.log("[App] unRegister")
      fcmService.unRegister()
      localNotificationService.unregister()
      Geolocation.clearWatch(watchID);
      Geolocation.stopObserving();
      console.log("position end!")
    }

  }, [])
  LogBox.ignoreAllLogs();

  const watchUserPosition = (userid) => {
    setWatchID(Geolocation.watchPosition(
      async (position) => {
        // this.setState({
        //   newLatitude: position.coords.latitude,
        //   newLongitude: position.coords.longitude,
        //   error: null,
        // });
        await updateToFirebase(position.coords.latitude, position.coords.longitude, userid)
        console.log("new position :" + position.coords.latitude + "," + position.coords.longitude)
      },
      (error) => console.log("watchUserPosition Error :" + JSON.stringify(error)),
      //{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 0.00001 },
      { enableHighAccuracy: true, distanceFilter: 5 },
    ))

  }

  const updateToFirebase = async (latitude, longitude, id) => {
    //var currentMomentDate = moment().format("YYYY-MM-DD HH:mm:ss")
    //console.log(contractId)
    await firebase.firestore().collection("Users").doc(id).set({
      //location: new firestore.GeoPoint(latitude, longitude)
      lat: latitude,
      long: longitude,
    })
      .then(() => {
        console.log("Document successfully written!");
        //setLocationstate("update location: " + latitude + " and " + longitude + " and " + id);

      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }

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
