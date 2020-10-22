import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { checkAuthState } from "./src/services/FireAuthHelper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";


import PhoneOTP from './src/screens/PhoneOTP';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Forgot from './src/screens/Forgot';
import Overview from './src/screens/Overview';



const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        <Stack.Navigator
          headerMode="none"
          initialRouteName={user ? "Overview" : "Login"}
        >
          <Stack.Screen name="PhoneOTP" component={PhoneOTP} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Overview" component={Overview} />
          <Stack.Screen name="Forgot" component={Forgot} />
        </Stack.Navigator>
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
