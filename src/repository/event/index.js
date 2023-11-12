import { dot } from 'dot-object';
import { Event } from '@/models';
import { eventFilters } from './util';

export const findAll = (user, query = {}) => {
  const filter = eventFilters(user, query.filter);
  const populate = [{ path: 'speakers', select: '-created_at -updated_at -__v' }];
  const options = {
    select: '-creator -creator_lock',
    lean: true,
    sort: query.sort,
    page: query.page,
    limit: query.limit,
    populate
  };
  return !query.page
    ? Event.find(filter).sort(options.sort).populate(populate).lean()
    : Event.paginate(filter, options);
};

export const insertOne = (data) => Event.create(data);

export const findOne = (filters) => Event.findOne(filters).lean();

export const findById = (id, user, filterFields = true) => {
  const baseFilters = { _id: id };
  let query = Event.findOne(eventFilters(user, baseFilters)).lean();
  if (filterFields) query = query.select('-creator_lock');
  return query.exec();
};

export const findOneAndUpdate = (filters, data) => Event.findOneAndUpdate(filters, dot(data), { new: true });

export const updateById = (id, data) => findOneAndUpdate({ _id: id }, data);

export const deleteById = (id) => Event.deleteOne({ _id: id });
