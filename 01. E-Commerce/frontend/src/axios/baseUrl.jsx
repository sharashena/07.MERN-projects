import axios from "axios";

export const baseUrl = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? import.meta.env.VITE_BASE_URL
      : "http://localhost:5000/api",
  withCredentials: true,
});

baseUrl.interceptors.request.use(
  req => {
    req.headers["Accept"] = "application/json";
    return req;
  },
  err => {
    return Promise.reject(err);
  }
);

baseUrl.interceptors.response.use(
  res => {
    return res;
  },
  async err => {
    const originalRequest = err.config;

    const authRoutes = [
      "/login",
      "/register",
      "/verify-email",
      "/forgot-password",
      "/reset-password",
    ];

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !authRoutes.includes(window.location.pathname)
    ) {
      originalRequest._retry = true;

      try {
        await baseUrl.get("/auth/refresh-token");
        return baseUrl(originalRequest);
      } catch (error) {
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(err);
  }
);
