import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://192.168.1.3:9000/api/v1/drivers/941287851231',
    headers: {
        'content-type':'application/octet-stream',
        'x-rapidapi-host':'example.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
    },
});

export default {
    getData: () =>
    instance({
        'method':'GET',
        'url':'/query',
        'params': {
            'search':'parameter',
        },
        transformResponse: [function (data) {
            // Do whatever you want to transform the data
            console.log('Transforming data...')

            const json = JSON.parse(data)

            // list of nested object keys
            const dates = Object.keys(json['nested object'])

            data = {
                dates
            }

            return data;
        }],
    }),
    postData: () =>
    instance({
        'method': 'POST',
        'url':'/api',
        'data': {
            'item1':'data1',
            'item2':'item2'
        },
        'headers': { 'content-type':'application/json' // override instance defaults
        },
    })
}