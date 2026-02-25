import { apiClient } from "./apiClient.js";

export const fetchReviews = async (params = {}) => {
  const { data } = await apiClient.get("/reviews", { params });
  return data.data;
};

/**
 * Fetch latest reviews for homepage display
 * @param {number} limit - Number of reviews to fetch (default: 6)
 * @returns {Promise<{data: Array, meta: {totalCount: number, averageRating: number}}>}
 */
export const fetchLatestReviews = async (limit = 6) => {
  const { data } = await apiClient.get("/reviews/latest", {
    params: { limit },
  });
  return data;
};

export const createReview = async (payload) => {
  const { data } = await apiClient.post("/reviews", payload);
  return data.data;
};

export const deleteReview = async (id) => {
  await apiClient.delete(`/reviews/${id}`);
};
