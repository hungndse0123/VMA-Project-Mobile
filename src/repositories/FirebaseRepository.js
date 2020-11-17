import Repository from "./Repository";
import moment from "moment";
import storage from "@react-native-firebase/storage";

export default {
    async getFirebaseLinks(newImg, delImg, oldImg, imgTypeName, ID) {
        if (newImg) {
            let index = 0;
            for (let img of newImg) {
                let url = await this.uploadImageToFirebase(img, imgTypeName, ID);
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
    // Upload image to firebase
    async uploadImageToFirebase(imageData, imgTypeName, ID) {
        return new Promise(async (resolve) => {
            let date = moment(new Date()).format("YYYYMMDDHHmmss");
            const storageRef = storage()
                .ref(imgTypeName + "-" + ID + "-" + date)
                .putFile(imageData);
            storageRef.on(
                `state_changed`,
                (snapshot) => {
                    this.uploadValue =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    console.log(error.message);
                },
                async () => {
                    this.uploadValue = 100;
                    storageRef.snapshot.ref.getDownloadURL().then((url) => {
                        resolve(url);
                    });
                }
            );
        });
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
}