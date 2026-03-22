import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
});

// Set default JSON content type only for non-FormData requests
axiosClient.interceptors.request.use(config => {
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

export default axiosClient;
