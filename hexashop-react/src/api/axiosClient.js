import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hexashop_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// We will handle response interceptor for 401 later, possibly emitting an event
// or handling it directly inside AuthContext if needed, 
// but it's cleaner to handle it here and redirect/dispatch an event.
// Let's create an event emitter approach or simply handle token clearance.

export const setupInterceptors = (logoutCallback) => {
  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid
        if (logoutCallback) {
          logoutCallback();
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosClient;
