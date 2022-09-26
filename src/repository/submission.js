import logger from '../utils/logger'
import Submission from '../models/submission'

export const insertSubmission = async (userId, question, link) => {
  const newSubmission = new Submission({
    user: userId,
    question,
    link,
    score: null,
    gradedBy: null
  })
  await newSubmission.save()
}

export const getSubmissions = async ({ sort = {}, filter = {}, page, limit = 10 }) => {
  const populate = ['user', 'graded_by', 'question']

  const options = {
    sort,
    page,
    limit,
    collation: {
      locale: 'en'
    },
    populate
  }
  return (await page)
    ? Submission.paginate(filter, options).catch((err) => {
        logger.error(`An error occurred when retrieving submissions - err: ${err.message}`)
        throw err
      })
    : Submission.find(filter).sort(sort).populate(populate).lean()
}

export const getSubmissionById = async (id) => {
  return await Submission.findById(id).lean()
}

export const getOneSubmission = async (filters, options = {}) => {
  return await Submission.findOne(filters, options).lean()
}

export const insertGrade = async (submission, score, admin) => {
  const query = { _id: submission }
  const newData = { score, graded_by: admin }
  await Submission.findOneAndUpdate(query, newData, { upsert: true })
}

export const getLatestScore = async ({ user, question }) => {
  const filters = {
    user,
    question,
    score: { $ne: null }
  }
  const sort = {
    created_at: 'desc'
  }
  const result = await Submission.findOne(filters).setOptions({ sort }).lean()
  if (result) return result.score
  else return 0
}

export const getSubmissionsByQuestion = async () => {
  return await Submission.aggregate([
    {
      $group: {
        _id: '$question',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $lookup: { from: 'questions', localField: '_id', foreignField: '_id', as: 'question' } },
    {
      $project: {
        _id: 0,
        question: 1,
        count: 1
      }
    }
  ])
}

export const getSubmissionCount = async (questionId) => {
  return (await Submission.distinct('user', { question: questionId })).length
}
