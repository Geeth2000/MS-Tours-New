import { apiClient } from "./apiClient.js";

export const fetchTours = async (params = {}) => {
  const { data } = await apiClient.get("/tours", { params });
  return data;
};

export const fetchTourBySlug = async (slug) => {
  const { data } = await apiClient.get(`/tours/${slug}`);
  return data.data;
};

// --- NEW: Added for Admin Edit Pages ---
export const fetchTourById = async (id) => {
  const { data } = await apiClient.get(`/tours/id/${id}`);
  return data.data;
};
// ---------------------------------------

export const createTour = async (payload) => {
  const { data } = await apiClient.post("/tours", payload);
  return data.data;
};

export const updateTour = async (id, payload) => {
  const { data } = await apiClient.put(`/tours/${id}`, payload);
  return data.data;
};

export const deleteTour = async (id) => {
  await apiClient.delete(`/tours/${id}`);
};
