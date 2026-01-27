import { apiClient } from "./apiClient.js";

export const register = async (payload) => {
  const { data } = await apiClient.post("/auth/register", payload);
  return data.data;
};

export const login = async (payload) => {
  const { data } = await apiClient.post("/auth/login", payload);
  return data.data;
};

export const fetchProfile = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data.data;
};

export const updateProfile = async (payload) => {
  const { data } = await apiClient.patch("/auth/me", payload);
  return data.data;
};
