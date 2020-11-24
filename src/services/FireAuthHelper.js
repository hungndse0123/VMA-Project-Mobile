import React from "react";
// import { Auth } from "../setup/firebase/FirebaseSetup";
import Auth from "@react-native-firebase/auth";
import messaging from '@react-native-firebase/messaging';
/**
 * @description Function to Login with Phone number.
 * @param phoneNumber -Phone of Facebook which get from facebook API.
 */

export const signInWithPhoneNumber = (phoneNumber) => {
  return new Promise(function (resolve, reject) {
    Auth()
      .signInWithPhoneNumber(phoneNumber)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * @description Function to Login with Facebook.
 * @param facebookToken -Token of Facebook which get from facebook API.
 */

export const signInWithFacebook = (facebookToken) => {
  const facebookCredential = Auth.FacebookAuthProvider.credential(facebookToken);

  return new Promise(function (resolve, reject) {
    Auth()
      .signInWithCredential(facebookCredential)
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * @description Function to Login with Gmail.
 * @param gmailToken - Token of Gmail which get from Gmail API.
 */
export const signInWithGmail = (gmailToken) => {
  const googleCredential = Auth.GoogleAuthProvider.credential(gmailToken);

  return new Promise(function (resolve, reject) {
    Auth()
      .signInWithCredential(googleCredential)
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * @description Function to Login with Apple.
 * @param identityToken - Token of Apple which get from Apple API.
 * @param nonce - nonce of Apple which get from Apple API.
 */
export const signInWithApple = (identityToken, nonce) => {
  const appleCredential = Auth.AppleAuthProvider.credential(identityToken, nonce);

  return new Promise(function (resolve, reject) {
    Auth()
      .signInWithCredential(appleCredential)
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * @description Function to Login with Email/Password.
 * @param email - Email of the user.
 * @param password - Password of the user.
 */

export const signInWithEmail = (email, password) => {
  return new Promise(function (resolve, reject) {
    Auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * @description Function to Register with Email/Password.
 * @param email - Email of the user.
 * @param password - Password of the user.
 */

export const signUpWithEmail = (email, password) => {
  return new Promise(function (resolve, reject) {
    Auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * @description Function to Signout user.
 * @param null.
 */

export const signOutUser = () => {
  return new Promise(function (resolve, reject) {
    Auth()
      .signOut()
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

let userLoaded = false;

/**
 * @description Function check if User is logged in or not.
 * @param null.
 * @returns User object if logged in otherwise null
 */

export const checkAuthState = () => {
  return new Promise((resolve, reject) => {
    if (userLoaded && Auth().currentUser != null) {
      resolve(Auth().currentUser);
    }
    const unsubscribe = Auth().onAuthStateChanged((user) => {
      userLoaded = true;
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

/**
 * @description Function to get Current LoggedIn User.
 * @param null.
 * @returns User object if logged in otherwise null
 */

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    if (Auth().currentUser) {
      resolve(Auth().currentUser);
    } else {
      const unsubscribe = Auth().onAuthStateChanged((user) => {
        userLoaded = true;
        unsubscribe();
        resolve(user);
      }, reject);
    }
  });
};

export async function getRegToken() {
  // Register the device with FCM
  await messaging().registerDeviceForRemoteMessages();

  // Get the token
  const token = await messaging().getToken();

  // Save the token
  console.log(token)
}

