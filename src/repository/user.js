import { moduleLogger } from '@sliit-foss/module-logger';
import { User } from '@/models';

const logger = moduleLogger('User-repository');

export const createUser = async (user) => {
  const newUser = (await new User(user).save()).toObject();
  delete newUser.password;
  return newUser;
};

export const getAllUsers = ({ sort = {}, filter = {}, page, limit = 10 }) => {
  const options = {
    page,
    limit,
    collation: {
      locale: 'en'
    }
  };

  if (Object.keys(sort).length > 0) options.sort = sort;

  if (filter.member_count) {
    filter.members = { $size: Number(filter.member_count) };
    delete filter.member_count;
  }

  const pipeline = User.aggregate([
    {
      $match: filter
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
              _id: '$question',
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

  return (page ? User.aggregatePaginate(pipeline, options) : pipeline).catch((err) => {
    logger.error(`An error occurred when retrieving users - err: ${err.message}`);
    throw err;
  });
};

export const getOneUser = async (filters, returnPassword = false) => {
  const user = await User.findOne(filters).lean();
  if (!user) return null;

  if (!returnPassword) delete user.password;
  return user;
};

export const findOneAndUpdateUser = async (filters, data) => {
  const user = await User.findOneAndUpdate(filters, data, { new: true }).lean();
  if (!user) return null;

  delete user.password;
  return user;
};

export const getAllUniverstyUserGroups = () => {
  return User.aggregate([
    {
      $match: {
        role: 'GROUP',
        is_verified: true
      }
    },
    {
      $group: {
        _id: '$university',
        count: { $sum: 1 },
        member_count: { $sum: { $size: '$members' } }
      }
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        name: '$_id',
        count: 1,
        member_count: 1
      }
    }
  ]);
};

export const findOneAndRemoveUser = (filters) => {
  return User.findOneAndRemove(filters);
};

export const getLeaderboardData = () => {
  return User.aggregate([
    {
      $match: {
        role: 'GROUP',
        is_verified: true
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
            $sort: {
              score: -1
            }
          },
          {
            $group: {
              _id: '$question',
              score: {
                $first: {
                  $ifNull: ['$score', 0]
                }
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
        score: 1
      }
    }
  ]);
};
