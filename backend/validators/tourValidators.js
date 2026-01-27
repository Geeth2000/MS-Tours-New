import Joi from "joi";

export const createTourSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  durationDays: Joi.number().integer().min(1).required(),
  pricePerPerson: Joi.number().min(0).required(),
  category: Joi.string()
    .valid("beach", "culture", "nature", "adventure", "wildlife", "heritage", "wellness")
    .required(),
  locations: Joi.array().items(Joi.string().trim()).default([]),
  highlights: Joi.array().items(Joi.string().trim()).default([]),
  itinerary: Joi.array()
    .items(
      Joi.object({
        day: Joi.number().integer().min(1).required(),
        title: Joi.string().trim().required(),
        description: Joi.string().trim().required(),
      })
    )
    .default([]),
  includes: Joi.array().items(Joi.string().trim()).default([]),
  excludes: Joi.array().items(Joi.string().trim()).default([]),
  heroImage: Joi.string().uri().optional(),
  galleryImages: Joi.array().items(Joi.string().uri()).default([]),
  isFeatured: Joi.boolean().default(false),
  tags: Joi.array().items(Joi.string().trim()).default([]),
  seasonalAvailability: Joi.object({
    startMonth: Joi.number().integer().min(1).max(12).optional(),
    endMonth: Joi.number().integer().min(1).max(12).optional(),
  }).optional(),
});

export const updateTourSchema = createTourSchema.fork(Object.keys(createTourSchema.describe().keys), (schema) =>
  schema.optional()
);
