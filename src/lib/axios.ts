import axios from "axios";
import { API_ROUTES } from "@/const/api";
import { toast } from "sonner";

// accessToken 관리
const ACCESS_TOKEN_KEY = "accessToken";

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const removeAccessToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

const clearAuthAndRedirect = () => {
  removeAccessToken();
  localStorage.removeItem("auth-storage");
  window.location.href = "/signin";
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // refreshToken 쿠키를 위해 필요
});

// Request interceptor: Bearer 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    // Content-Type 설정
    if (!(config.headers["Content-Type"] === "multipart/form-data")) {
      config.headers["Content-Type"] = "application/json";
    } else {
      delete config.headers["Content-Type"];
    }

    // accessToken이 있으면 Authorization 헤더에 추가
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: 401 에러 시 토큰 리프레시
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refreshToken(쿠키)으로 새 accessToken 발급
        const response = await apiClient.post(API_ROUTES.AUTH.REFRESH.url);
        const newAccessToken = response.data?.payload?.accessToken;

        if (newAccessToken) {
          setAccessToken(newAccessToken);
          // 원래 요청에 새 토큰 적용 후 재시도
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        toast.error("세션 만료", {
          description: "다시 로그인해주세요.",
        });
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;