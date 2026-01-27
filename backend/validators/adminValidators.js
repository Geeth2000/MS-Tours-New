import Joi from "joi";

export const updateOwnerStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "approved", "rejected").required(),
  reason: Joi.string().trim().allow("", null),
});
