import { dot } from 'dot-object';
import { User } from '@/models';
import { roles } from '@/models/user';

export const create = async (user) => {
  const newUser = (await new User(user).save()).toObject();
  delete newUser.password;
  return newUser;
};

export const findAll = ({ sort = {}, filter = {}, page, limit = 10 }) => {
  const options = {
    page,
    limit,
    collation: {
      locale: 'en'
    }
  };

  if (Object.keys(sort).length > 0) options.sort = sort;

  const aggregate = User.aggregate([
    {
      $match: {
        is_verified: true,
        ...filter
      }
    },
    {
      $lookup: {
        from: 'submissions',
        localField: '_id',
        foreignField: 'user',
        as: 'submissions',
        pipeline: [
          {
            $group: {
              _id: '$challenge',
              score: {
                $max: { $ifNull: ['$score', 0] }
              }
            }
          }
        ]
      }
    },
    {
      $addFields: {
        score: { $sum: '$submissions.score' }
      }
    },
    { $unset: ['password', 'verification_code', 'submissions'] }
  ]);
  return page ? User.aggregatePaginate(aggregate, options) : aggregate;
};

export const findOne = async (filters, returnPassword = false) => {
  const user = await User.findOne(filters).lean();
  if (!user) return null;

  if (!returnPassword) delete user.password;
  return user;
};

export const findOneAndUpdate = async (filters, data) => {
  const user = await User.findOneAndUpdate(filters, dot(data), { new: true }).lean();
  if (!user) return null;

  delete user.password;
  return user;
};

export const findAndUpdate = (filters, data) => User.updateMany(filters, data, { new: true }).lean();

export const getAllUserGroups = () => {
  return User.aggregate([
    {
      $match: {
        role: roles.entrant,
        is_verified: true
      }
    },
    {
      $group: {
        _id: '$domain',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        name: '$_id',
        count: 1
      }
    }
  ]);
};

export const findOneAndRemove = (filters) => {
  return User.findOneAndRemove(filters);
};

export const getLeaderboard = () => {
  return User.aggregate([
    {
      $match: {
        role: roles.entrant,
        is_verified: true,
        is_active: true
      }
    },
    {
      $lookup: {
        from: 'submissions',
        localField: '_id',
        foreignField: 'user',
        as: 'submissions',
        pipeline: [
          {
            $match: {
              score: { $gt: 0 }
            }
          },
          {
            $sort: {
              score: -1,
              created_at: 1
            }
          },
          {
            $group: {
              _id: '$challenge',
              score: {
                $first: '$score'
              },
              created_at: {
                $first: '$created_at'
              }
            }
          }
        ]
      }
    },
    {
      $addFields: {
        score: { $sum: '$submissions.score' },
        last_submission_time: {
          $max: '$submissions.created_at'
        }
      }
    },
    {
      $sort: {
        score: -1,
        last_submission_time: 1
      }
    },
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        university: 1,
        score: 1,
        eliminated: 1
      }
    }
  ]);
};
