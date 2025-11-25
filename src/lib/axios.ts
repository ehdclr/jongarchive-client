import axios from "axios";
import { API_ROUTES } from "@/const/api";
import { ERROR_MESSAGES } from "@/const/error";
import { toast } from "sonner";

const clearAuthAndRedirect = () => {
  localStorage.removeItem("auth-storage");
  window.location.href = "/signin";
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    if (!(config.headers["Content-Type"] === "multipart/form-data")) {
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
    const errorType = error.response?.data?.error?.type;
  
    if (
      error.response?.status === 401 && 
      errorType === ERROR_MESSAGES.UNAUTHORIZED.ACCESS_TOKEN_EXPIRED.type
    ) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await apiClient.post(API_ROUTES.AUTH.REFRESH.url);
          return apiClient(originalRequest);
        } catch (refreshError) {
          toast.error("세션 만료", {
            description: "다시 로그인해주세요.",
          });
          clearAuthAndRedirect();
          return Promise.reject(refreshError);
        }
      }
    }

    if (
      error.response?.status === 401 &&
      errorType === ERROR_MESSAGES.UNAUTHORIZED.REFRESH_TOKEN_EXPIRED.type
    ) {
      toast.error("세션 만료", {
        description: "다시 로그인해주세요.",
      });
      clearAuthAndRedirect();
    }

    return Promise.reject(error);
  }
);

export default apiClient;