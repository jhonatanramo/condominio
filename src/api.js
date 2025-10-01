import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export default api;
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error de API:', error);
    return Promise.reject(error);
  }
);