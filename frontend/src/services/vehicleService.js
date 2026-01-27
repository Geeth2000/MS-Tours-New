import { apiClient } from "./apiClient.js";

export const fetchVehicles = async (params = {}) => {
  const { data } = await apiClient.get("/vehicles", { params });
  return data;
};

export const fetchVehicleById = async (id) => {
  const { data } = await apiClient.get(`/vehicles/${id}`);
  return data.data;
};

export const fetchMyVehicles = async () => {
  const { data } = await apiClient.get("/vehicles/me");
  return data.data;
};

export const createVehicle = async (payload) => {
  const { data } = await apiClient.post("/vehicles", payload);
  return data.data;
};

export const updateVehicle = async (id, payload) => {
  const { data } = await apiClient.put(`/vehicles/${id}`, payload);
  return data.data;
};

export const deleteVehicle = async (id) => {
  await apiClient.delete(`/vehicles/${id}`);
};
