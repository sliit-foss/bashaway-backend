import mongoose from 'mongoose';
import { ROLE } from '@/constants';
import Question from '@/models/question';
import { prefixObjectKeys } from '@/utils';
import { questionFilters } from './util';

const ObjectId = mongoose.Types.ObjectId;

export const findAllQuestions = (user, query = {}) => {
  if (!query.filter) {
    query.filter = {};
  }

  const filter = questionFilters(user, query.filter);

  const options = {
    select: '-creator',
    lean: true,
    sort: query.sort
  };

  if (query.page) {
    options.page = query.page;
  }

  if (query.limit) {
    options.limit = query.limit;
  }

  return !query.page ? Question.find(filter).sort(options.sort).lean() : Question.paginate(filter, options);
};

export const insertQuestion = (data) => {
  return new Question(data).save();
};

export const findQuestion = (filters) => {
  return Question.findOne(filters).lean();
};

export const getQuestionById = (id, user) => {
  const filters = {
    _id: { $eq: new ObjectId(id) },
    $or: [{ creator_lock: false }, { creator_lock: true, creator: user._id }]
  };
  if (user.role !== ROLE.ADMIN) {
    filters.enabled = true;
  }
  const query = Question.findOne(filters).lean();
  return query.exec();
};

export const findAndUpdateQuestion = (filters, data) => {
  return Question.findOneAndUpdate(filters, data, { new: true }).lean();
};

export const deleteAQuestion = (filters) => {
  return Question.deleteOne(filters);
};

export const bulkUpdateQuestions = (filters, data) => {
  return Question.updateMany(filters, data);
};

export const getMaxScore = async (questionId) => {
  return (await Question.findById(questionId).lean()).max_score;
};

export const getQuestionSubmissions = (user, teamFilters, submissionFilters) => {
  return Question.aggregate([
    {
      $match: questionFilters(user)
    },
    {
      $lookup: {
        from: 'submissions',
        localField: '_id',
        foreignField: 'question',
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
              'user.role': ROLE.GROUP
            }
          }
        ]
      }
    },
    {
      $project: {
        _id: 0,
        question: {
          name: '$name'
        },
        submission_count: { $size: '$submissions' }
      }
    },
    { $sort: { submission_count: -1 } }
  ]);
};
