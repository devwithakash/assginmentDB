import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 1. Request Interceptor: Attach Access Token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Handle Token Expiry & Refresh
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        // Call backend to get new access token
        const res = await axios.post("http://localhost:5000/api/auth/refresh", {
          refreshToken,
        });

        const { accessToken } = res.data;
        localStorage.setItem("accessToken", accessToken);

        // Update header and retry original request
        originalRequest.headers.Authorization = accessToken;
        return instance(originalRequest);
      } catch (err) {
        // If refresh fails, logout user completely
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;