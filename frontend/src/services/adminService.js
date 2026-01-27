import { apiClient } from "./apiClient.js";

// --- GET REQUESTS ---

export const fetchAdminSummary = async () => {
  // Matches route: GET /api/v1/admin/summary (or /dashboard/summary depending on your backend route)
  const { data } = await apiClient.get("/admin/summary");
  return data.data;
};

export const fetchPendingOwners = async () => {
  const { data } = await apiClient.get("/admin/owners/pending");
  return data.data;
};

export const fetchUsers = async (params = {}) => {
  const { data } = await apiClient.get("/admin/users", { params });
  return data.data;
};

// --- PATCH/UPDATE REQUESTS ---

export const updateOwnerStatus = async (id, payload) => {
  const { data } = await apiClient.patch(`/admin/owners/${id}/status`, payload);
  return data.data;
};

// --- DELETE REQUESTS (New) ---

export const deleteUser = async (id) => {
  const { data } = await apiClient.delete(`/admin/users/${id}`);
  return data;
};

export const deleteTour = async (id) => {
  const { data } = await apiClient.delete(`/admin/tours/${id}`);
  return data;
};

export const deleteVehicleAdmin = async (id) => {
  const { data } = await apiClient.delete(`/admin/vehicles/${id}`);
  return data;
};

export const deletePackageAdmin = async (id) => {
  const { data } = await apiClient.delete(`/admin/packages/${id}`);
  return data;
};
