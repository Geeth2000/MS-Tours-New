import Joi from "joi";

export const createVehicleSchema = Joi.object({
  title: Joi.string().trim().required(),
  type: Joi.string().valid("car", "van", "bus", "suv", "jeep", "tuk", "other").required(),
  make: Joi.string().trim().optional(),
  model: Joi.string().trim().optional(),
  year: Joi.number().integer().min(1990).max(new Date().getFullYear() + 1).optional(),
  transmission: Joi.string().valid("manual", "automatic").optional(),
  fuelType: Joi.string().valid("petrol", "diesel", "hybrid", "electric").optional(),
  seatingCapacity: Joi.number().integer().min(1).required(),
  pricePerDay: Joi.number().min(0).required(),
  features: Joi.array().items(Joi.string().trim()).default([]),
  description: Joi.string().trim().allow("", null),
  images: Joi.array().items(Joi.string().uri()).default([]),
  location: Joi.object({
    city: Joi.string().trim().optional(),
    district: Joi.string().trim().optional(),
  }).optional(),
});

export const updateVehicleSchema = createVehicleSchema.fork(
  Object.keys(createVehicleSchema.describe().keys),
  (schema) => schema.optional()
);
