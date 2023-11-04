import * as couponService from '@/services/coupon';
import { makeResponse } from '@/utils/response';

export const getAllCoupons = async (req, res) => {
  const data = await couponService.retrieveAll(req.query);
  return makeResponse({ res, data, message: 'Coupons retrieved successfully' });
};

export const createCoupon = async (req, res) => {
  const speaker = await couponService.create(req.body, req.user);
  return makeResponse({ res, status: 201, data: speaker, message: 'Coupon added successfully' });
};

export const getCouponById = async (req, res) => {
  const result = await couponService.retrieve(req.params.coupon_id);
  return makeResponse({ res, data: result, message: 'Coupon retrieved successfully' });
};

export const updateCoupon = async (req, res) => {
  const speaker = await couponService.update(req.params.coupon_id, req.body);
  return makeResponse({ res, data: speaker, message: 'Coupon updated successfully' });
};

export const deleteCoupon = async (req, res) => {
  await couponService.deleteOne(req.params.coupon_id);
  return makeResponse({ res, message: 'Coupon deleted successfully' });
};
