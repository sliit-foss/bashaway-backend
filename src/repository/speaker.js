import createError from 'http-errors';
import { Event, Speaker } from '@/models';
import { transaction } from '@/utils';

export const insertOne = (data) => Speaker.create(data);

export const findAll = ({ sort = {}, filter = {}, page, limit = 10 }) => {
  if (page) {
    return Speaker.paginate(filter, {
      sort,
      page,
      limit
    });
  }
  return Speaker.find(filter).sort(sort).lean();
};

export const findById = (id) => Speaker.findById(id).lean();

export const findOne = (filters, options = {}) => Speaker.findOne(filters, options).lean();

export const findOneAndUpdate = (filters, data) => Speaker.findOneAndUpdate(filters, data, { new: true }).lean();

export const updateById = (id, data) => findOneAndUpdate({ _id: id }, data);

export const deleteById = async (id) => {
  const [result, success] = await transaction([
    Speaker.findByIdAndDelete(id),
    Event.updateMany({ speakers: id }, { $pull: { speakers: id } })
  ]);
  if (!success) throw new createError(424, 'Failed to delete speaker');
  return result;
};
