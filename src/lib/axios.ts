import axios from "axios";
import { API_ROUTES } from "@/const/api";
import { ERROR_MESSAGES } from "@/const/error";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    if (!(config.headers["Content-Type"] === "application/json")) {
      config.headers["Content-Type"] = "application/json";
    } else {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
  
    //access token 만료 시 리프레시 토큰 사용
    if (error.response?.status === 401 && error.response?.data?.error?.type === ERROR_MESSAGES.UNAUTHORIZED.ACCESS_TOKEN_EXPIRED.type) {
      originalRequest._retry = true;
      try {
        const { data } = await apiClient.post(API_ROUTES.AUTH.REFRESH.url);
        return apiClient(originalRequest);
      } catch (refreshError) {
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401 && error.response?.data?.error?.type === ERROR_MESSAGES.UNAUTHORIZED.REFRESH_TOKEN_EXPIRED.type) {
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
