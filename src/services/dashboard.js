import { getAllQuestions } from '../repository/question'
import { getSubmissionsByQuestion } from '../repository/submission'
import { getAllUniverstyUserGroups } from '../repository/user'

export const getAllQuestionsSubmissions = async () => {
  let questionData = await getAllQuestions()
  questionData.docs = await Promise.all(
    questionData.docs.map(async (question) => {
      const submissions = await getSubmissionsByQuestion(question._id)
      return { question, submissions: submissions.length }
    })
  )
  return questionData
}

export const getRegistrations = async () => {
  const userGroups = await getAllUniverstyUserGroups()
  return {
    university_counts: userGroups,
    total_registrations: userGroups.reduce((acc, curr) => acc + curr.count, 0)
  }
}
