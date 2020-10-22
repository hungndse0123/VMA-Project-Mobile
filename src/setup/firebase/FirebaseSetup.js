import React from "react";
import App from "../../../App";
import firebase from "@react-native-firebase/app";
import Auth from "@react-native-firebase/auth";
import FirebaseConfig from "./FirebaseConfig";

/**
 * @description Initializing Firebase when first time load.
 */

 if (!firebase.apps.length) {
  firebase.initializeApp(FirebaseConfig);
 }

/**
 * @description export Firebase and Authentication to reuse in other modules.
 */

export { firebase, Auth };

const FirebaseSetup = () => {
  return <App />;
};

export default FirebaseSetup;
