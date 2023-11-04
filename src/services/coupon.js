import crypto from 'crypto';
import createError from 'http-errors';
import * as couponRepository from '@/repository/coupon';
import * as eventRepository from '@/repository/event';

export const retrieveAll = (query) => couponRepository.findAll(query);

export const create = async (data, user) => {
  const event = await eventRepository.findById(data.event, user);
  if (!event) throw new createError(404, "Event doesn't exist");
  return couponRepository.insertOne({ ...data, code: crypto.randomUUID() });
};

export const retrieve = async (id) => {
  const coupon = await couponRepository.findById(id);
  if (!coupon) throw new createError(404, "Coupon doesn't exist");
  return coupon;
};

export const update = async (id, data) => {
  const coupon = await retrieve(id);
  if (coupon.ticket) throw new createError(400, "This coupon can't be updated as it is already used");
  return couponRepository.updateById(id, data);
};

export const deleteOne = async (id) => {
  const coupon = await retrieve(id);
  if (coupon.ticket) throw new createError(400, "This coupon can't be deleted as it is already used");
  return couponRepository.deleteById(id);
};
