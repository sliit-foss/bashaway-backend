import logger from '../utils/logger'
import Submission from '../models/submission'

export const insertSubmission = async (user, question, link) => {
  const newSubmission = new Submission({ user, question, link, score: null, gradedBy: null })
  await newSubmission.save()
}

export const getSubmissions = async ({ sort = {}, filters = {}, pageNum = 1, pageSize = 10 }) => {
  const options = {
    sort,
    page: pageNum,
    limit: pageSize,
    collation: {
      locale: 'en',
    },
  }

  return await Submission.paginate(filters, options, (error, result) => {
    if (!error) {
      return result
    } else {
      logger.error(error)
      throw 'An error occurred when retrieving submissions'
    }
  })
}

export const insertGrade = async (submission, score, admin) => {
  const query = { _id: submission }
  const newData = { score, gradedBy: admin }

  await Submission.findOneAndUpdate(query, newData , { upsert: true })
}
