import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
});

// Set default JSON content type only for non-FormData requests
// Ensure Authorization headers are always preserved
axiosClient.interceptors.request.use(config => {
  // Don't override FormData - let browser handle Content-Type with proper boundary
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  // Ensure headers object exists
  if (!config.headers) {
    config.headers = {};
  }
  return config;
});

export default axiosClient;
