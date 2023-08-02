import { moduleLogger } from '@sliit-foss/module-logger';
import { User } from '@/models';
import { computeScore } from './utils';

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

  const aggregateQuery = () =>
    User.aggregate([
      {
        $match: filter
      },
      ...computeScore,
      { $unset: ['password', 'verification_code'] }
    ]);

  return (page ? User.aggregatePaginate(aggregateQuery(), options) : aggregateQuery()).catch((err) => {
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
        role: 'GROUP'
      }
    },
    {
      $group: {
        _id: '$university',
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

export const findOneAndRemoveUser = (filters) => {
  return User.findOneAndRemove(filters);
};

export const getLeaderboardData = () => {
  return User.aggregate([
    {
      $match: {
        role: 'GROUP'
      }
    },
    ...computeScore,
    {
      $sort: {
        score: -1
      }
    },
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        score: 1
      }
    }
  ]);
};
