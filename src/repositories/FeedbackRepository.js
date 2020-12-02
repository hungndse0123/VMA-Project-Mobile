import Repository from "./Repository";
import firebase from "@react-native-firebase/app";

const resource = "/feedbacks";

export default {
    createFeedback(data) {
        return new Promise((resolve, reject) => {
            var token = '';
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    //console.log(user); // It shows the Firebase user
                    //console.log(firebase.auth().user); // It is still undefined
                    user.getIdToken().then(function (idToken) {  // <------ Check this line
                        token = idToken;
                        Repository.post(resource, data, {
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