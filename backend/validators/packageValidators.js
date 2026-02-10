import Joi from "joi";
import { PACKAGE_TYPES } from "../config/constants.js";

export const createPackageSchema = Joi.object({
  vehicle: Joi.string().hex().length(24).allow("", null).optional(),
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  packageType: Joi.string()
    .valid(...Object.values(PACKAGE_TYPES))
    .required(),
  durationDays: Joi.number().integer().min(1).required(),
  pricePerGroup: Joi.number().min(0).allow("", null).optional(),
  pricePerPerson: Joi.number().min(0).allow("", null).optional(),
  includes: Joi.array().items(Joi.string().trim()).default([]),
  excludes: Joi.array().items(Joi.string().trim()).default([]),
  locations: Joi.array().items(Joi.string().trim()).default([]),
  images: Joi.array().items(Joi.string()).default([]),
  isFeatured: Joi.boolean().default(false),
  status: Joi.string()
    .valid("draft", "pending", "published", "archived")
    .optional(),
});

export const updatePackageSchema = createPackageSchema.fork(
  Object.keys(createPackageSchema.describe().keys),
  (schema) => schema.optional(),
);

export const packageStatusSchema = Joi.object({
  status: Joi.string()
    .valid("draft", "pending", "published", "archived")
    .required(),
});
