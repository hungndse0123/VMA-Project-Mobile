import Repository from "./Repository";

const vehicle_doc_resource = "/vehicles/documents";
const user_doc_resource = "/users";
const user_doc_resource_2 = "/user-documents";

export default {
    // Get detailed driver
    getVehicleDetailDocument(userId) {
        return new Promise((resolve, reject) => {
            Repository.get(`${vehicle_doc_resource}/${userId}`)
                .then((res) => {
                    resolve(res.data.vehicleDetail);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    getVehicleDocument(filter) {
        return new Promise((resolve, reject) => {
            Repository.get(`${vehicle_doc_resource}${filter}`)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    getUserDocument(userId) {
        return new Promise((resolve, reject) => {
            Repository.get(`${user_doc_resource}/${userId}/user-documents`)
                .then((res) => {
                    resolve(res.data.userDocuments);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    getUserDetailDocument(docId) {
        return new Promise((resolve, reject) => {
            Repository.get(`${user_doc_resource_2}/${docId}`)
                .then((res) => {
                    resolve(res.data.userDocumentDetail);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    getUserDocumentType() {
        return new Promise((resolve, reject) => {
            Repository.get(`${user_doc_resource_2}/types`)
                .then((res) => {
                    resolve(res.data.userDocumentTypes);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
}