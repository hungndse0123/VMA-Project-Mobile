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
            console.log(`${resource}${filter}`)
            Repository.get(`${resource}${filter}`)
                .then((res) => {
                    resolve(res.data.vehicleList);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    getVehicleCount(filter) {
        return new Promise((resolve, reject) => {
            //console.log(`${resource}/count${filter}`)
            Repository.get(`${resource}/count${filter}`)
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
                    resolve(res.data.tripList);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    getVehicleBrand() {
        return new Promise((resolve, reject) => {
            Repository.get(`${resource}/misc/brands`)
                .then((res) => {
                    resolve(res.data.brands);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    getVehicleType() {
        return new Promise((resolve, reject) => {
            Repository.get(`${resource}/misc/types`)
                .then((res) => {
                    resolve(res.data.vehicleTypes);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    getVehicleStatusList() {
        return new Promise((resolve, reject) => {
            Repository.get(`${resource}/status`)
                .then((res) => {
                    resolve(res.data.vehicleStatus);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
}