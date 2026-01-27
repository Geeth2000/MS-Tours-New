import { apiClient } from "./apiClient.js";

export const fetchAdminSummary = async () => {
  const { data } = await apiClient.get("/admin/dashboard/summary");
  return data.data;
};

export const fetchPendingOwners = async () => {
  const { data } = await apiClient.get("/admin/owners/pending");
  return data.data;
};

export const updateOwnerStatus = async (id, payload) => {
  const { data } = await apiClient.patch(`/admin/owners/${id}/status`, payload);
  return data.data;
};

export const fetchUsers = async (params = {}) => {
  const { data } = await apiClient.get("/admin/users", { params });
  return data.data;
};
