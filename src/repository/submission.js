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

export const getLatestScore = async ({ user, question }) => {
  const filters = {
    user,
    question,
    score: { $ne: null }
  }

  const options = {
    sort: {
      created_at: 'desc'
    },
    page: 1,
    limit: 1,
    collation: {
      locale: 'en',
    },
  }

  const result = await Submission.paginate(filters, options, (error, result) => {
    if (!error) {
      return result
    } else {
      logger.error(error)
      throw 'An error occurred when retrieving submissions'
    }
  })

  return result.docs[0].score || 0
}
