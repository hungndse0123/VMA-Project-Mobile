import Repository from "./Repository";
import firebase from "@react-native-firebase/app";

const vehicle_doc_resource = "/requests/vehicles/documents";
const user_doc_resource = "/requests/users/document";

export default {
    createVehicleDocumentRequests(requests) {
        return new Promise((resolve, reject) => {
            var token = '';
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    //console.log(user); // It shows the Firebase user
                    //console.log(firebase.auth().user); // It is still undefined
                    user.getIdToken().then(function (idToken) {  // <------ Check this line
                        token = idToken;
                        Repository.post(vehicle_doc_resource, requests, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
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
    createUserDocumentRequests(requests) {
        return new Promise((resolve, reject) => {
            var token = '';
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    //console.log(user); // It shows the Firebase user
                    //console.log(firebase.auth().user); // It is still undefined
                    user.getIdToken().then(function (idToken) {  // <------ Check this line
                        token = idToken;
                        Repository.post(user_doc_resource, requests, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
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
}