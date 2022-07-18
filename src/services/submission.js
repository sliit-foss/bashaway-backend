import { insertSubmission, getSubmissions, insertGrade } from '../repository/submission'

export const createSubmission = async ({ question, link }, { _id }) => {
  await insertSubmission(_id, question, link)
}

export const viewSubmissions = async (query) => {
  return await getSubmissions(query)
}

export const gradeSubmission = async (submissionId, { score }, { _id }) => {
  await insertGrade(submissionId, score, _id)
}
