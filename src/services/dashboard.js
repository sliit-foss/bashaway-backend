import { getSubmissionsByQuestion } from '../repository/submission'
import { getAllUniverstyUserGroups } from '../repository/user'

export const getAllQuestionsSubmissions = async () => {
  return getSubmissionsByQuestion()
}

export const getRegistrations = async () => {
  const userGroups = await getAllUniverstyUserGroups()
  return {
    university_counts: userGroups,
    total_registrations: userGroups.reduce((acc, curr) => acc + curr.count, 0)
  }
}
