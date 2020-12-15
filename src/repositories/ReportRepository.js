import Repository from "./Repository";

const resource = "/reports";

export default {
    getContributorIncomesReportData(filter) {
        return new Promise((resolve, reject) => {
            Repository.get(`${resource}/contributor-income${filter}`)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    getContributorIncomesSummaryReportData(filter) {
        return new Promise((resolve, reject) => {
            Repository.get(`${resource}/contributor-income${filter}`)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },

    getDriverIncomesReportData(filter) {
        return new Promise((resolve, reject) => {
            Repository.get(`${resource}/driver-income${filter}`)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
    getDriverIncomesSummaryReportData(filter) {
        return new Promise((resolve, reject) => {
            Repository.get(`${resource}/driver-income${filter}`)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    },
}