import { getOneSubmission, getSubmissionCount } from '../repository/submission'

export const attachSubmissionAttributesToQuestion = async (question) => {
  question.total_submissions = await getSubmissionCount(question._id)
  const filters = { question: question._id }
  const options = { sort: { created_at: -1 } }
  const latestSubmission = await getOneSubmission(filters, options)
  question.submitted_at = latestSubmission ? latestSubmission.created_at : null
}
