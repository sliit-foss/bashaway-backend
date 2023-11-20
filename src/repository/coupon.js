import { Coupon } from '@/models';

export const insertOne = (data) => Coupon.create(data);

export const findAll = ({ sort = {}, filter = {}, page, limit = 10 }) => {
  if (page) {
    return Coupon.paginate(filter, {
      sort,
      page,
      limit
    });
  }
  return Coupon.find(filter).sort(sort).lean();
};

export const findById = (id) => Coupon.findById(id).lean();

export const findByCode = (code) => Coupon.findOne({ code }).populate('ticket').lean();

export const findOne = (filters, options = {}) => Coupon.findOne(filters, options).lean();

export const findOneAndUpdate = (filters, data) => Coupon.findOneAndUpdate(filters, data, { new: true }).lean();

export const updateById = (id, data) => findOneAndUpdate({ _id: id }, data);

export const deleteById = (id) => Coupon.findByIdAndDelete(id);
