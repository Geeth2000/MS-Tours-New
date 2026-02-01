import { apiClient } from "./apiClient.js";

// Get logged-in user's own custom trip requests
export const fetchMyCustomRequests = async () => {
  const { data } = await apiClient.get("/custom-requests/my-requests");
  return data.data;
};

// Create a new custom trip request
export const createCustomRequest = async (payload) => {
  const { data } = await apiClient.post("/custom-requests", payload);
  return data.data;
};

// Update user's own custom request
export const updateMyCustomRequest = async (id, payload) => {
  const { data } = await apiClient.patch(
    `/custom-requests/my-requests/${id}`,
    payload,
  );
  return data.data;
};

// Delete user's own custom request
export const deleteMyCustomRequest = async (id) => {
  const { data } = await apiClient.delete(`/custom-requests/my-requests/${id}`);
  return data;
};
