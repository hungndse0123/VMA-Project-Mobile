import axios from "axios";

const baseDomain = "http://192.168.43.125:9000";
//const baseDomain = "http://vma-api.azurewebsites.net";
const baseURL = `${baseDomain}/api/v1`;

export default axios.create({
  baseURL: baseURL,
});