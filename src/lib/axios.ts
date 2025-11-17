import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
   if(!(config.headers['Content-Type'] === 'application/json')) {
    config.headers['Content-Type'] = 'application/json';
   } else {
    //TODO: form-data 처리
    delete config.headers['Content-Type'];
   }
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.data?.error === "Unauthorized") {
      const refreshToken = error.config.headers["X-Refresh-Token"];
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        // 직접 서버에 리프레시 요청
        const response = await axios.post(
          `${SERVER_API_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const { accessToken } = response.data.data;
        document.cookie = `accessToken=${accessToken}; path=/; maxAge=${15 * 60 * 1000}`; //15분 후 만료

        return apiClient(error.config);
      } catch (refreshError) {
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;