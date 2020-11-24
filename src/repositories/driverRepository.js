import Repository from "./Repository";
import firebase from "@react-native-firebase/app";

const resource = "/drivers";

export default {
  // Get detailed driver
  getDetailDriver(userId) {
    return new Promise((resolve, reject) => {
      Repository.get(`${resource}/${userId}`)
        .then((res) => {
          resolve(res.data.driverDetail);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  getDriver(filter) {
    return new Promise((resolve, reject) => {
      Repository.get(`${resource}${filter}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Create driver
  create(driver) {
    return new Promise((resolve, reject) => {
      Repository.post(resource, driver)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  getIssuedDrivers(id, filter) {
    return new Promise((resolve, reject) => {
      Repository.get(`${resource}/contributors/${id}/issued-drivers${filter}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          console.log(err)
          reject(err.response.data);
        });
    });
  },
}