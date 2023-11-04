import { Joi } from 'celebrate';

export const addCouponSchema = {
  event: Joi.string().hex().length(24).required(),
  discount_percentage: Joi.number().valid(25, 50, 75, 100).required()
};

export const updateCouponSchema = {
  discount_percentage: addCouponSchema.discount_percentage.optional()
};

export const couponIdSchema = {
  coupon_id: Joi.string().hex().length(24).required()
};
