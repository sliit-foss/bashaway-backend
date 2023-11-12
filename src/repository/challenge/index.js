import Challenge from '@/models/challenge';
import { roles } from '@/models/user';
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

export const getSubmissions = (user) => {
  return Challenge.aggregate([
    {
      $match: challengeFilters(user)
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
