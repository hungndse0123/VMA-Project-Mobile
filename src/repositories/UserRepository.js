import Repository from "./Repository";
import firebase from "@react-native-firebase/app";

const resource = "/users";

export default {
  updateUserStatusByUserId(userId, status) {
    return new Promise((resolve, reject) => {
      Repository.patch(`${resource}/${userId}?userStatus=${status}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  getUserrole() {

    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          //console.log(user); // It shows the Firebase user
          //console.log(firebase.auth().user); // It is still undefined

          user.getIdToken().then(function (idToken) {  // <------ Check this line
            var data = {
              "idToken": idToken,
            }
            //console.log(token); // It shows the Firebase token now
            Repository.post(`${resource}/role-token`, data)
              .then((res) => {
                resolve(res);
              })
              .catch((err) => {
                reject(err.response.data);
              });
          });
        }
      });


    });
  },
  createClientRegistrationToken(token) {
    return new Promise((resolve, reject) => {
      var token = '';
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          //console.log(user); // It shows the Firebase user
          //console.log(firebase.auth().user); // It is still undefined
          user.getIdToken().then(function (idToken) {  // <------ Check this line
            token = idToken;
            Repository.post(`${resource}/registration-token`, {
              token: token
            })
              .then((res) => {
                resolve(res);
                console.log("Create token done")
              })
              .catch((err) => {
                reject(err.response.data);
              });
          });
        }
      });

    });
  }

}