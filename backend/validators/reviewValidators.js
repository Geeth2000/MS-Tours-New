import Joi from "joi";

export const createReviewSchema = Joi.object({
  tour: Joi.string().hex().length(24).optional(),
  vehicle: Joi.string().hex().length(24).optional(),
  package: Joi.string().hex().length(24).optional(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().trim().allow("", null),
}).custom((value, helpers) => {
  if (!value.tour && !value.vehicle && !value.package) {
    return helpers.error("any.invalid", "Review must be associated with a tour, vehicle, or package");
  }
  return value;
});
