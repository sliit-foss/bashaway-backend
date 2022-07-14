import { getLatestScore } from '../repository/submission'
import { insertScore } from '../repository/user'

export const updateScoreService = async (user) => {
  // TODO: call the getAllquestionIds() in question services
  const questions = ['12345678901234567890aaa1', '12345678901234567890aaa2']
  // dummy question id's added

  const promises = questions.map((question) => {
    return getLatestScore({ user, question })
  })

  const result = await Promise.all(promises)
  const scoreSum = result.reduce((current, acc) => {
    return current + acc
  }, 0)

  insertScore(user, scoreSum)
}
