import { insertSubmission, getSubmissions, insertGrade } from '../repository/submission'

export const createSubmission = async (reqBody) => {
  const { question, link } = reqBody

  // TODO: getting user's id
  const user = '123456789012345678901234'
  // dummy value added

  await insertSubmission(user, question, link)
}

export const viewSubmissions = async (query) => {
  return await getSubmissions(query)
}

export const gradeSubmission = async (reqBody) => {
  const { submission, score } = reqBody

  // TODO: getting admin's id
  const admin = '12345678901234567890abcd'
  // dummy value added

  await insertGrade(submission, score, admin)
}
