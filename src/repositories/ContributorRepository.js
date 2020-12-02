import Repository from "./Repository";

const resource = "/contributors";

export default {
    getDetailContributor(userId) {
        return new Promise((resolve, reject) => {
            Repository.get(`${resource}/${userId}`)
                .then((res) => {
                    resolve(res.data.contributorDetail);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
}