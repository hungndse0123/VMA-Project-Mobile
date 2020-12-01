import axios from "axios";

const baseDomain = "http://192.168.1.3:9000";
//const baseDomain = "http://vma-api.azurewebsites.net";
const baseURL = `${baseDomain}/api/v1`;

export default axios.create({
  baseURL: baseURL,
});