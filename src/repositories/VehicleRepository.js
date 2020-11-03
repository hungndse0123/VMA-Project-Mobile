import Repository from "./Repository";

const resource = "/vehicles";

export default {
    // Get detailed driver
    getDetailVehicle(userId) {
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
    getVehicle(filter) {
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
}