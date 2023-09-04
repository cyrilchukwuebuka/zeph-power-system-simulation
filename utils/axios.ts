import axios from "axios";

const baseURL = `https://api.thingspeak.com/channels`;

const headers = {};

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
