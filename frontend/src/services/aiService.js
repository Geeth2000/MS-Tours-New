import { apiClient } from "./apiClient.js";

export const getPlaceRecommendations = async (payload) => {
  const { data } = await apiClient.post("/ai/places", payload);
  return data.data;
};

export const getPackageRecommendations = async (payload = {}) => {
  const { data } = await apiClient.post("/ai/packages", payload);
  return data.data;
};

export const askTravelAssistant = async (question) => {
  const { data } = await apiClient.post("/ai/chat", { question });
  return data.data;
};
