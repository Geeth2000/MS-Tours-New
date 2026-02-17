import { apiClient } from "./apiClient.js";

export const fetchPackages = async (params = {}) => {
  const { data } = await apiClient.get("/packages", { params });
  return data;
};

export const fetchPackageById = async (id) => {
  const { data } = await apiClient.get(`/packages/${id}`);
  return data.data;
};

export const fetchPackagesByOwner = async (ownerId) => {
  const { data } = await apiClient.get("/packages", {
    params: { owner: ownerId, status: "published" },
  });
  return data;
};

export const fetchMyPackages = async () => {
  const { data } = await apiClient.get("/packages/me");
  return data.data;
};

export const createPackage = async (payload) => {
  const { data } = await apiClient.post("/packages", payload);
  return data.data;
};

export const updatePackage = async (id, payload) => {
  const { data } = await apiClient.put(`/packages/${id}`, payload);
  return data.data;
};

export const updatePackageStatus = async (id, status) => {
  const { data } = await apiClient.patch(`/packages/${id}/status`, { status });
  return data.data;
};

export const deletePackage = async (id) => {
  await apiClient.delete(`/packages/${id}`);
};
