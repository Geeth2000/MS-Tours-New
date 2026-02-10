import Joi from "joi";

export const createVehicleSchema = Joi.object({
  title: Joi.string().trim().required(),
  type: Joi.string()
    .valid("car", "van", "bus", "suv", "jeep", "tuk", "other")
    .required(),
  make: Joi.string().trim().allow("", null).optional(),
  model: Joi.string().trim().allow("", null).optional(),
  year: Joi.number()
    .integer()
    .min(1990)
    .max(new Date().getFullYear() + 1)
    .allow("", null)
    .optional(),
  transmission: Joi.string()
    .valid("manual", "automatic")
    .allow("", null)
    .optional(),
  fuelType: Joi.string()
    .valid("petrol", "diesel", "hybrid", "electric")
    .allow("", null)
    .optional(),
  seatingCapacity: Joi.number().integer().min(1).required(),
  pricePerDay: Joi.number().min(0).required(),
  features: Joi.array().items(Joi.string().trim()).default([]),
  description: Joi.string().trim().allow("", null),
  images: Joi.array().items(Joi.string()).default([]),
  location: Joi.object({
    city: Joi.string().trim().allow("", null).optional(),
    district: Joi.string().trim().allow("", null).optional(),
  }).optional(),
  status: Joi.string().valid("active", "inactive", "maintenance").optional(),
});

export const updateVehicleSchema = createVehicleSchema.fork(
  Object.keys(createVehicleSchema.describe().keys),
  (schema) => schema.optional(),
);
