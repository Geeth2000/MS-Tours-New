import Joi from "joi";

export const createBookingSchema = Joi.object({
  tour: Joi.string().hex().length(24).optional(),
  vehicle: Joi.string().hex().length(24).optional(),
  package: Joi.string().hex().length(24).optional(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional(),
  travelers: Joi.object({
    adults: Joi.number().integer().min(1).default(1),
    children: Joi.number().integer().min(0).default(0),
  }).default({ adults: 1, children: 0 }),
  totalPrice: Joi.number().min(0).required(),
  commissionPercent: Joi.number().min(0).max(100).optional(),
  payment: Joi.object({
    method: Joi.string().valid("cash", "online").default("cash"),
    paidAmount: Joi.number().min(0).optional(),
    paidAt: Joi.date().iso().optional(),
  }).optional(),
  notes: Joi.string().trim().allow("", null),
}).custom((value, helpers) => {
  if (!value.tour && !value.vehicle && !value.package) {
    return helpers.error("any.invalid", "At least one of tour, vehicle, or package must be provided");
  }
  return value;
});

export const updateBookingStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "confirmed", "cancelled", "completed").required(),
  notes: Joi.string().trim().allow("", null),
});
