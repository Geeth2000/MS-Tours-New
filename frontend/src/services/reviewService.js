import { apiClient } from "./apiClient.js";

export const fetchReviews = async (params = {}) => {
  const { data } = await apiClient.get("/reviews", { params });
  return data.data;
};

export const createReview = async (payload) => {
  const { data } = await apiClient.post("/reviews", payload);
  return data.data;
};

export const deleteReview = async (id) => {
  await apiClient.delete(`/reviews/${id}`);
};
