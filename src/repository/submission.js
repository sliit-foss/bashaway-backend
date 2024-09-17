import { ROLE } from '@/constants';
import { Submission } from '@/models';
import { prefixObjectKeys } from '@/utils';

export const insertSubmission = (userId, question, link) => {
  return Submission.create({
    user: userId,
    question,
    link
  });
};

export const getSubmissions = ({ sort = {}, filter = {}, page, limit = 10 }) => {
  const populate = ['user', 'graded_by', 'question'];
  if (filter.graded !== undefined) {
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
    populate,
    lean: true
  };

  return page ? Submission.paginate(filter, options) : Submission.find(filter).sort(sort).populate(populate).lean();
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
  ).lean();
};

export const getDistinctSubmissions = (questionId) => {
  return Submission.aggregate([
    { $match: { question: questionId } },
    { $group: { _id: '$user' } },
    { $project: { _id: 0, user: '$_id' } }
  ]);
};

export const getTeamSubmissions = (filters = {}, userFilters = {}) => {
  return Submission.aggregate([
    { $match: filters },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
    { $addFields: { user: { $arrayElemAt: ['$user', 0] } } },
    {
      $match: {
        ...prefixObjectKeys(userFilters, 'user.'),
        'user.role': ROLE.GROUP
      }
    },
    {
      $group: {
        _id: '$user._id',
        name: { $first: '$user.name' },
        submission_count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        name: 1,
        submission_count: 1
      }
    },
    { $sort: { submission_count: -1 } }
  ]);
};
