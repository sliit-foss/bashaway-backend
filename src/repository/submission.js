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

export const getSubmissions = async ({ sort = {}, filter = {}, pageNum = 1, pageSize = 10 }) => {
  const options = {
    sort,
    page: pageNum,
    limit: pageSize,
    collation: {
      locale: 'en'
    },
    populate: ['user', 'graded_by', 'question']
  }
  return await Submission.paginate(filter, options).catch((err) => {
    logger.error(`An error occurred when retrieving submissions - err: ${err.message}`)
    throw err
  })
}

export const getSubmissionById = async (id) => {
  return await Submission.findById(id).lean()
}

export const getOneSubmission = async (filters) => {
  return await Submission.findOne(filters).lean()
}

export const insertGrade = async (submission, score, admin) => {
  const query = { _id: submission }
  const newData = { score, gradedBy: admin }
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

export const getSubmissionsByQuestion = async (question) => {
  return await Submission.find({ question }).lean()
}
