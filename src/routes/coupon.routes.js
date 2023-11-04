import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { createCoupon, deleteCoupon, getAllCoupons, getCouponById, updateCoupon } from '@/controllers/coupon';
import { addCouponSchema, couponIdSchema, updateCouponSchema } from '@/validations/coupon';

const coupons = express.Router();

coupons.get('/', tracedAsyncHandler(getAllCoupons));
coupons.post('/', celebrate({ [Segments.BODY]: addCouponSchema }), tracedAsyncHandler(createCoupon));
coupons.get('/:coupon_id', celebrate({ [Segments.PARAMS]: couponIdSchema }), tracedAsyncHandler(getCouponById));
coupons.patch(
  '/:coupon_id',
  celebrate({ [Segments.PARAMS]: couponIdSchema, [Segments.BODY]: updateCouponSchema }),
  tracedAsyncHandler(updateCoupon)
);
coupons.delete('/:coupon_id', celebrate({ [Segments.PARAMS]: couponIdSchema }), tracedAsyncHandler(deleteCoupon));

export default coupons;
