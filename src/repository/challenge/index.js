import Challenge from '@/models/challenge';
import { challengeFilters } from './util';

export const findAll = (user, query = {}) => {
  const filter = challengeFilters(user, query.filter);
  const options = {
    select: '-creator -creator_lock',
    lean: true,
    sort: query.sort,
    page: query.page,
    limit: query.limit
  };
  return !query.page ? Challenge.find(filter).sort(options.sort).lean() : Challenge.paginate(filter, options);
};

export const insertOne = (data) => Challenge.create(data);

export const findOne = (filters) => Challenge.findOne(filters).lean();

export const findById = (id, user, filterFields = true) => {
  let query = Challenge.findOne(challengeFilters(user, { _id: id })).lean();
  if (filterFields) query = query.select('-creator_lock');
  return query.exec();
};

export const findOneAndUpdate = (filters, data) => Challenge.findOneAndUpdate(filters, data, { new: true });

export const deleteById = (id) => Challenge.deleteOne({ _id: id });
