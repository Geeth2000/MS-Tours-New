import axios from "axios";
import { API_BASE_URL } from "./config.js";
import { getAuthToken, useAuthStore } from "../hooks/useAuthStore.js";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return error.message || "Something went wrong";
};
