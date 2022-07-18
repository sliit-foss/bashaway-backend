import { getLatestScore } from '../repository/submission'
import { findOneAndUpdateUser } from '../repository/user'
import { findByIdAndUpdateUser } from "../repository/user"

export const updateScoreService = async (user) => {
  // TODO: call the getAllquestionIds() in question services
  const questions = ['12345678901234567890aaa1', '12345678901234567890aaa2']
  // dummy question id's added
  const result = await Promise.all(questions.map((question) => {
    return getLatestScore({ user, question })
  }))
  const scoreSum = result.reduce((current, acc) => {
    return current + acc
  }, 0)
  return await findOneAndUpdateUser({ _id: user }, { score: scoreSum })
}

export const updateUserdetails = async (user , userDetails) => {
    await findByIdAndUpdateUser({ _id: user }, userDetails)
}