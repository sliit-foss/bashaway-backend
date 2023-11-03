import mongoose from 'mongoose';
import Challenge from '@/models/challenge';
import { prefixObjectKeys } from '@/utils';
import { challengeFilters } from './util';

const ObjectId = mongoose.Types.ObjectId;

export const findAll = (user, query = {}) => {
  if (!query.filter) {
    query.filter = {};
  }

  const filter = challengeFilters(user, query.filter);

  const options = {
    select: '-creator -creator_lock',
    lean: true,
    sort: query.sort
  };

  if (query.page) {
    options.page = query.page;
  }

  if (query.limit) {
    options.limit = query.limit;
  }

  return !query.page ? Challenge.find(filter).sort(options.sort).lean() : Challenge.paginate(filter, options);
};

export const insertOne = (data) => {
  return new Challenge(data).save();
};

export const findOne = (filters) => Challenge.findOne(filters).lean();

export const findById = (id, user, filterFields = true) => {
  const filters = {
    _id: { $eq: new ObjectId(id) },
    $or: [{ creator_lock: false }, { creator_lock: true, creator: user._id }]
  };
  if (user.role !== 'ADMIN') {
    filters.enabled = true;
  }
  let query = Challenge.findOne(filters).lean();
  if (filterFields) query = query.select('-creator_lock');
  return query.exec();
};

export const findAndUpdate = (filters, data) => {
  return Challenge.findOneAndUpdate(filters, data, { new: true });
};

export const deleteById = (id) => {
  return Challenge.deleteOne({ _id: id });
};

export const getMaxScore = async (challengeId) => {
  return (await Challenge.findById(challengeId).lean()).max_score;
};

export const getSubmissions = (user, teamFilters, submissionFilters) => {
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
            $match: submissionFilters
          },
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
              ...prefixObjectKeys(teamFilters, 'user.'),
              'user.role': 'ATTENDEE'
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
