import Repository from "./Repository";

const resource = "/contracts";

export default {
    // Get detailed driver
    getDetailContract(contractId) {
        return new Promise((resolve, reject) => {
            Repository.get(`${resource}/${contractId}`)
                .then((res) => {
                    resolve(res.data.contractDetail);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    getContract(filter) {
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
    create(contract) {
        return new Promise((resolve, reject) => {
            Repository.post(resource, contract)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    async getFirebaseLinks(newImg, delImg, oldImg, imgTypeName) {
        if (newImg) {
            let index = 0;
            for (let img of newImg) {
                let url = await this.uploadImageToFirebase(img, imgTypeName);
                let vehicleDocumentImageId =
                    delImg !== null && delImg.length > index
                        ? delImg[index].vehicleDocumentImageId
                        : 0;
                let imgObj = {
                    vehicleDocumentImageId: vehicleDocumentImageId,
                    imageLink: url,
                };
                if (delImg !== null && delImg.length > 0) {
                    for (let i = 0; i < oldImg.length; i++) {
                        let imgA = oldImg[i];
                        if (
                            imgA.vehicleDocumentImageId ===
                            delImg[index].vehicleDocumentImageId
                        ) {
                            this.$delete(oldImg, i);
                        }
                    }
                }
                oldImg.push(imgObj);
                index++;
            }
        }
        return oldImg;
    },
    // Delete firebase imgs
    async deleteFirebaseLink(imgs) {
        if (imgs !== null) {
            for (let img of imgs) {
                await this.deleteImageFromFirebase(img.imageLink);
            }
            imgs = [];
        }
    },
    getPassengerList(contractVehicleId) {
        return new Promise((resolve, reject) => {
            Repository.get(`${resource}/vehicles/passengers${contractVehicleId}`)
                .then((res) => {
                    resolve(res.data.passengerList);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    createPassengerList(list) {
        return new Promise((resolve, reject) => {
            Repository.post(`${resource}/vehicles/passengers`, list)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    updateContractVehicleStatus(data) {
        return new Promise((resolve, reject) => {
            Repository.patch(`${resource}/vehicles`, data)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    }
}