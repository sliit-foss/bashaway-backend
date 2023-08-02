import { moduleLogger } from '@sliit-foss/module-logger';
import Submission from '@/models/submission';

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

export const insertGrade = async (submission, score, admin) => {
  const query = { _id: submission };
  const newData = { score, graded_by: admin };
  await Submission.findOneAndUpdate(query, newData, { upsert: true });
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

export const getLeaderboardData = () => {
  return Submission.aggregate([
    {
      $group: {
        _id: '$user',
        name: { $first: '$user.name' },
        email: { $first: '$user.email' },
        total_score: { $sum: '$score' }
      }
    },
    {
      $sort: {
        total_score: -1
      }
    },
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        total_score: 1
      }
    }
  ]);
};
