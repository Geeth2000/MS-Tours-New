import { StatusCodes } from "http-status-codes";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getSmartPlaceRecommendations,
  getBestPackageRecommendations,
  getTravelAssistantReply,
} from "../services/recommendationService.js";

export const recommendPlaces = asyncHandler(async (req, res) => {
  const recommendations = getSmartPlaceRecommendations(req.body || {});
  return res.status(StatusCodes.OK).json(apiResponse({ data: recommendations }));
});

export const recommendPackages = asyncHandler(async (req, res) => {
  const recommendations = await getBestPackageRecommendations(req.body || {});
  return res.status(StatusCodes.OK).json(apiResponse({ data: recommendations }));
});

export const travelAssistant = asyncHandler(async (req, res) => {
  const { question } = req.body;
  const answer = await getTravelAssistantReply(question);
  return res.status(StatusCodes.OK).json(apiResponse({ data: { answer } }));
});
