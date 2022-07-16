import logger from '../utils/logger'
import Submission from '../models/submission'

export const insertSubmission = async (user, question, link) => {
  const newSubmission = new Submission({ user, question, link, score: null, gradedBy: null })
  await newSubmission.save()
}

export const getAllSubmissions = async ({ sort = {}, filters = {}, pageNum = 1, pageSize = 10 }) => {
  const options = {
    sort,
    page: pageNum,
    limit: pageSize,
    collation: {
      locale: 'en',
    },
  }
  return await Submission.paginate(filters, options).catch(err => {
    logger.error(`An error occurred when retrieving submissions - err: ${err.message}`)
    throw err
  })
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
    score: { $ne: null },
  }
  const sort = {
    created_at: 'desc',
  }
  const result = await getAllSubmissions({ sort, filters, pageSize: 1 })
  if (result.docs.length === 0) return 0
  return result.docs[0].score || 0
}
