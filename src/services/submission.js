import { insertSubmission, getSubmissions, insertGrade } from '../repository/submission'

export const createSubmission = async (reqBody, user) => {
  await insertSubmission(user._id, reqBody.question, reqBody.link)
}

export const viewSubmissions = async (query) => {
  return await getSubmissions(query)
}

export const gradeSubmission = async (submissionId, { score }) => {
  // TODO: getting admin's id
  const admin = '12345678901234567890abcd'
  // dummy value added
  await insertGrade(submissionId, score, admin)
}
