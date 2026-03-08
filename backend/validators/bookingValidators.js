import Joi from "joi";

export const createBookingSchema = Joi.object({
  tour: Joi.string().hex().length(24).optional(),
  vehicle: Joi.string().hex().length(24).optional(),
  package: Joi.string().hex().length(24).optional(),

  // Customer-confirmed booking details
  customerName: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Customer name is required",
    "string.min": "Customer name must be at least 2 characters",
    "any.required": "Customer name is required",
  }),
  customerPhone: Joi.string().trim().min(6).max(20).required().messages({
    "string.empty": "Phone number is required",
    "string.min": "Phone number must be at least 6 characters",
    "any.required": "Phone number is required",
  }),
  customerEmail: Joi.string().email().trim().allow("", null).optional(),
  pickupLocation: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Pickup location is required",
    "string.min": "Pickup location must be at least 2 characters",
    "any.required": "Pickup location is required",
  }),
  dropoffLocation: Joi.string().trim().max(200).allow("", null).optional(),
  pickupTime: Joi.string().trim().max(20).allow("", null).optional(),
  travelerCount: Joi.number().integer().min(1).required().messages({
    "number.min": "At least 1 traveler is required",
    "any.required": "Number of travelers is required",
  }),
  specialRequests: Joi.string().trim().max(1000).allow("", null).optional(),

  startDate: Joi.date().iso().min("now").required().messages({
    "date.min": "Pickup date cannot be in the past",
    "any.required": "Pickup date is required",
  }),
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
    return helpers.error(
      "any.invalid",
      "At least one of tour, vehicle, or package must be provided",
    );
  }
  return value;
});

export const updateBookingStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "cancelled", "completed")
    .required(),
  notes: Joi.string().trim().allow("", null),
});
