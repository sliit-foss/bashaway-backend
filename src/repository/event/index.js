import { dot } from 'dot-object';
import { Event } from '@/models';
import { roles } from '@/models/user';
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
  let query = Event.findOne(eventFilters(user, { _id: id })).lean();
  if (filterFields) query = query.select('-creator_lock');
  return query.exec();
};

export const findOneAndUpdate = (filters, data) => Event.findOneAndUpdate(filters, dot(data), { new: true });

export const updateById = (id, data) => findOneAndUpdate({ _id: id }, data);

export const deleteById = (id) => Event.deleteOne({ _id: id });

export const getSubmissions = (user) => {
  return Event.aggregate([
    {
      $match: eventFilters(user)
    },
    {
      $lookup: {
        from: 'submissions',
        localField: '_id',
        foreignField: 'challenge',
        as: 'submissions',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $addFields: {
              user: { $first: '$user' }
            }
          },
          {
            $match: {
              'user.role': roles.entrant
            }
          }
        ]
      }
    },
    {
      $project: {
        _id: 0,
        challenge: {
          name: '$name'
        },
        submission_count: { $size: '$submissions' }
      }
    },
    { $sort: { submission_count: -1 } }
  ]);
};
