import axios from 'axios';

const ax = axios.create({
    baseURL: '/api/v1',
    headers:{
        origin: 'VmaApplication',
        "Content-Type": "text/plain",
        withCredentials: true,
    }
});


/**
 * @return {number}
 */
 
export async function GetData(url) {
    try {
        const response = await ax.get(url);
        return response;
    }catch (e) {
        console.log(e);
    }
}

export async function PostData(url,body) {
    try {
        const response = await ax.post(url,body);
        return response;
    }catch (e) {
        console.log(e)
    }
}