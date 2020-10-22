import {getToken} from '../utils/Store'

export const SERVER_ADDRESS = 'https://localhost:9000'
const API_ENDPOINT = SERVER_ADDRESS + '/api/'

const getParam = (method, data, token = null) => {
  return {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(data),
  }
}

const handleDataResponse = res => {
  const success = res && res.success
  if (!success) {
    throw {
      message: res.data.message,
      code: res.data.code,
    }
  } else {
    return res.data
  }
}

export const request = async ({
  endpoint,
  method = 'GET',
  body,
  token = null,
}) => {
  token = token || (await getToken())
  return fetch(API_ENDPOINT + endpoint, getParam(method, body, token))
    .then(res => {
      try {
        return res.json()
      } catch (e) {
        throw e
      }
    })
    .then(data => handleDataResponse(data))
    .catch(error => {throw error})
}
