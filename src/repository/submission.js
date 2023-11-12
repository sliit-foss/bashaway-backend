import { moduleLogger } from '@sliit-foss/module-logger';
import { isUndefined } from 'lodash';
import { Submission } from '@/models';

const logger = moduleLogger('Submission-repository');

export const create = (userId, challenge, link) => {
  return Submission.create({
    user: userId,
    challenge,
    link
  });
};

export const findAll = ({ sort = {}, filter = {}, page, limit = 10 }) => {
  const populate = ['user', 'graded_by', 'challenge'];
  if (!isUndefined(filter.graded)) {
    if (filter.graded) {
      filter.$or = [{ graded_by: { $ne: null } }, { automatically_graded: true }];
    } else {
      filter.$or = [{ graded_by: null }, { graded_by: { $exists: false } }];
      filter.automatically_graded = false;
    }
  }
  const options = {
    sort,
    page,
    limit,
    collation: {
      locale: 'en'
    },
    populate
  };
  return page
    ? Submission.paginate(filter, options).catch((err) => {
        logger.error(`An error occurred when retrieving submissions - err: ${err.message}`);
        throw err;
      })
    : Submission.find(filter).sort(sort).populate(populate).lean();
};

export const findById = (id) => Submission.findById(id).lean();

export const findWithUserAndChallenge = (id) =>
  Submission.findById(id)
    .populate([
      'user',
      {
        path: 'challenge',
        populate: ['event']
      }
    ])
    .lean();

export const findOne = (filters, options = {}) => {
  return Submission.findOne(filters, options).lean();
};

export const updateScore = async (submission, score, automated, userId) => {
  await Submission.findOneAndUpdate(
    { _id: submission },
    { score, graded_by: userId, automatically_graded: automated },
    { upsert: true }
  );
};

export const getDistinctSubmissions = (challengeId) => {
  return Submission.aggregate([
    { $match: { challenge: challengeId } },
    { $group: { _id: '$user' } },
    { $project: { _id: 0, user: '$_id' } }
  ]);
};
