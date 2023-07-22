import mongoose from 'mongoose';
import Question from '@/models/question';

const ObjectId = mongoose.Types.ObjectId;

export const findAllQuestions = (user, query = {}) => {
  if (!query.filter) {
    query.filter = {};
  }
  let filter;
  if (user.role == 'ADMIN') {
    filter = {
      $or: [{ creator_lock: false }, { creator_lock: true, creator: user._id }],
      $and: [query.filter]
    };
  } else {
    query.filter.enabled = true;
  }
  filter = {
    $or: [{ creator_lock: false }, { creator_lock: true, creator: user._id }],
    $and: [query.filter]
  };

  const options = {
    select: '-creator -creator_lock',
    lean: true,
    sort: query.sort || { created_at: -1 }
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
  return Question.findOne(filters);
};

export const getQuestionById = (id, user, filterFields = true) => {
  let query = Question.find({
    $and: [
      { _id: { $eq: new ObjectId(id) } },
      {
        $or: [{ creator_lock: false }, { creator_lock: true, creator: user._id }]
      }
    ]
  }).lean();
  if (filterFields) query = query.select('-creator_lock');
  return query.exec();
};

export const getAllQuestionIds = async (filters = {}) => {
  const questions = await Question.find(filters).select('_id').lean();
  return questions.map((question) => question._id);
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
