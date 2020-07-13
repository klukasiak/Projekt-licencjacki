import axios from "axios";

export default axios.create({
  baseURL: `https://${location.host}/api`,
  headers: {
    "Content-type": "application/json"
  },
  withCredentials: true
}); 