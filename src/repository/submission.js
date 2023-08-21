import { moduleLogger } from '@sliit-foss/module-logger';
import { isUndefined } from 'lodash';
import { Submission } from '@/models';

const logger = moduleLogger('Submission-repository');

export const insertSubmission = async (userId, question, link) => {
  const newSubmission = new Submission({
    user: userId,
    question,
    link,
    score: null,
    gradedBy: null
  });
  await newSubmission.save();
};

export const getSubmissions = async ({ sort = {}, filter = {}, page, limit = 10 }) => {
  const populate = ['user', 'graded_by', 'question'];

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
  return (await page)
    ? Submission.paginate(filter, options).catch((err) => {
        logger.error(`An error occurred when retrieving submissions - err: ${err.message}`);
        throw err;
      })
    : Submission.find(filter).sort(sort).populate(populate).lean();
};

export const getSubmissionById = (id) => {
  return Submission.findById(id).lean();
};

export const getOneSubmission = (filters, options = {}) => {
  return Submission.findOne(filters, options).lean();
};

export const insertGrade = async (submission, score, automated, userId) => {
  await Submission.findOneAndUpdate(
    { _id: submission },
    { score, graded_by: userId, automatically_graded: automated },
    { upsert: true }
  );
};

export const getSubmissionsByQuestion = () => {
  return Submission.aggregate([
    {
      $group: {
        _id: '$question',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $lookup: { from: 'questions', localField: '_id', foreignField: '_id', as: 'question' } },
    { $unwind: '$question' },
    {
      $project: {
        _id: 0,
        question: 1,
        count: 1
      }
    }
  ]);
};

export const getSubmissionCount = async (questionId) => {
  return (await Submission.distinct('user', { question: questionId })).length;
};
