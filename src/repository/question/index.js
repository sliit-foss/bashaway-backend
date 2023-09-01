import mongoose from 'mongoose';
import { questionFilters } from './util';
import Question from '@/models/question';

const ObjectId = mongoose.Types.ObjectId;

export const findAllQuestions = (user, query = {}) => {
  if (!query.filter) {
    query.filter = {};
  }

  const filter = questionFilters(user, query.filter);

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

  return !query.page ? Question.find(filter).sort(options.sort).lean() : Question.paginate(filter, options);
};

export const insertQuestion = (data) => {
  return new Question(data).save();
};

export const findQuestion = (filters) => {
  return Question.findOne(filters).lean();
};

export const getQuestionById = (id, user, filterFields = true) => {
  const filters = {
    _id: { $eq: new ObjectId(id) },
    $or: [{ creator_lock: false }, { creator_lock: true, creator: user._id }]
  };
  if (user.role !== 'ADMIN') {
    filters.enabled = true;
  }
  let query = Question.findOne(filters).lean();
  if (filterFields) query = query.select('-creator_lock');
  return query.exec();
};

export const findAndUpdateQuestion = (filters, data) => {
  return Question.findOneAndUpdate(filters, data, { new: true });
};

export const deleteAQuestion = (filters) => {
  return Question.deleteOne(filters);
};

export const getMaxScore = async (questionId) => {
  return (await Question.findById(questionId).lean()).max_score;
};

export const getQuestionSubmissions = (user) => {
  return Question.aggregate([
    {
      $match: questionFilters(user)
    },
    { $lookup: { from: 'submissions', localField: '_id', foreignField: 'question', as: 'submissions' } },
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
