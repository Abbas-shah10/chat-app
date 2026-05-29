import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

axios.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("userInfo");

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);

    if (parsedUser?.token && config.url !== "/api/v1/users/refresh") {
      config.headers.Authorization = `Bearer ${parsedUser.token}`;
    }
  }

  return config;
});

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (newToken) => {
  refreshQueue.forEach((callback) => callback(newToken));
  refreshQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/v1/users/refresh"
    ) {
      originalRequest._retry = true;

      const storedUser = JSON.parse(localStorage.getItem("userInfo"));

      if (!storedUser?.refreshToken) {
        localStorage.removeItem("userInfo");
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data } = await axios.post("/api/v1/users/refresh", {
            refreshToken: storedUser.refreshToken,
          });

          const updatedUser = {
            ...storedUser,
            token: data.accessToken,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };

          localStorage.setItem("userInfo", JSON.stringify(updatedUser));
          processQueue(data.accessToken);
          isRefreshing = false;
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(null);
          localStorage.removeItem("userInfo");
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        refreshQueue.push((newToken) => {
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          resolve(axios(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  },
);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
