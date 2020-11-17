import Repository from "./Repository";

const resource = "/vehicles";

export default {
    // Get detailed driver
    getDetailVehicle(userId) {
        return new Promise((resolve, reject) => {
            Repository.get(`${resource}/${userId}`)
                .then((res) => {
                    resolve(res.data.vehicleDetail);
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

    getCurrentlyAssignedVehicleByDriverId(id) {
        return new Promise((resolve, reject) => {
            Repository.get(`${resource}/drivers/${id}`)
                .then((res) => {
                    resolve(res.data.vehicleCurrent);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    getVehicleTrip(id, filter) {
        return new Promise((resolve, reject) => {
            console.log(`/contracts${resource}/${id}/trips${filter}`)
            Repository.get(`contracts${resource}/${id}/trips${filter}`)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
}