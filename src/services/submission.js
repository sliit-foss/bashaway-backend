import {
  insertSubmission,
  getSubmissions,
  getSubmissionById,
  insertGrade,
} from '../repository/submission'
import { getMaxScore } from '../repository/question'

export const createSubmission = async ({ question, link }, { _id }) => {
  await insertSubmission(_id, question, link)
}

export const viewSubmissions = async (query) => {
  return await getSubmissions(query)
}

export const gradeSubmission = async (submissionId, { score }, { _id }) => {
  const submission = await getSubmissionById(submissionId)
  const maxScore = await getMaxScore(submission.question.toString())

  if (score < 0)
    return 'Error: score must be greater than or equal to 0'
  else if (maxScore < score)
    return 'Error: score must be less than or equal to the max score for the question'
  else
    await insertGrade(submissionId, score, _id)
}
