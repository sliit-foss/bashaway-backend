import Question from '../models/question'
import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

export const findAllQuestions = async (user, query) => {
  if (!query.filter) {
    query.filter = {}
  }
  let filter
  if (user.role == 'ADMIN') {
    filter = {
      $or: [{ creator_lock: false }, { creator_lock: true, creator: user._id }],
      $and: [query.filter]
    }
  }
  query.filter.enabled = true
  filter = {
    $or: [{ creator_lock: false }, { creator_lock: true, creator: user._id }],
    $and: [query.filter]
  }

  const options = {
    select: '-creator -creator_lock',
    lean: true
  }

  if (query.page) {
    options.page = query.page
  }

  if (query.limit) {
    options.limit = query.limit
  }

  return !query.page ? Question.find(filter).lean() : Question.paginate(filter, options)
}

export const insertQuestion = async (data) => {
  return await new Question(data).save()
}

export const findQuestion = async (filters) => {
  return await Question.findOne(filters)
}

export const getQuestionById = async (id, user, filterFields = true) => {
  let query = Question.find({
    $and: [
      { _id: { $eq: new ObjectId(id) } },
      {
        $or: [{ creator_lock: false }, { creator_lock: true, creator: user._id }]
      }
    ]
  })
  if (filterFields) query = query.select('-creator -creator_lock')
  return await query.exec()
}

export const getAllQuestionIds = async (filters = {}) => {
  const questions = await Question.find(filters).select('_id').lean()
  return questions.map((question) => question._id)
}

export const findAndUpdateQuestion = async (filters, data) => {
  return await Question.findOneAndUpdate(filters, data, { new: true })
}

export const deleteAQuestion = async (filters) => {
  return await Question.deleteOne(filters)
}

export const getMaxScore = async (questionId) => {
  return (await Question.findById(questionId).lean()).max_score
}

export const getAllQuestions = async (pageSize = 10, pageNum = 1) => {
  const options = {
    page: pageNum,
    limit: pageSize
  }

  return await Question.paginate({}, options).catch((err) => {
    logger.error(`An error occurred when retrieving questions - err: ${err.message}`)
  })
}
