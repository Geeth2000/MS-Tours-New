import Joi from "joi";
import { USER_ROLES } from "../config/constants.js";

export const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid(...Object.values(USER_ROLES)).default(USER_ROLES.TOURIST),
  phone: Joi.string().trim().optional(),
  onboarding: Joi.object({
    documents: Joi.object({
      nicNumber: Joi.string().trim().optional(),
      drivingLicenseNumber: Joi.string().trim().optional(),
      vehicleRegistrationNumber: Joi.string().trim().optional(),
    }).optional(),
  }).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).optional(),
  lastName: Joi.string().trim().min(2).max(50).optional(),
  phone: Joi.string().trim().optional(),
  address: Joi.object({
    street: Joi.string().trim().allow("", null),
    city: Joi.string().trim().allow("", null),
    district: Joi.string().trim().allow("", null),
    country: Joi.string().trim().allow("", null),
  }).optional(),
  preferences: Joi.object({
    budget: Joi.number().min(0).optional(),
    durationDays: Joi.number().min(0).optional(),
    interests: Joi.array().items(Joi.string()).optional(),
  }).optional(),
});
