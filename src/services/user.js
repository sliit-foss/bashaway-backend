import { getLatestScore } from '../repository/submission'
import { findOneAndUpdateUser } from '../repository/user'
import { getOneUser } from '../repository/user'

export const updateScoreService = async (user) => {
  // TODO: call the getAllquestionIds() in question services
  const questions = ['12345678901234567890aaa1', '12345678901234567890aaa2']
  // dummy question id's added

  const result = await Promise.all(
    questions.map((question) => {
      return getLatestScore({ user, question })
    }),
  )

  const scoreSum = result.reduce((current, acc) => {
    return current + acc
  }, 0)

  return await findOneAndUpdateUser({ _id: user }, { score: scoreSum })
}

export const updateAllScoresService = async () => {
  console.log("Im here")
  // TODO: call the getAllUserIds() in user services
  const users = ['62d7ad70b13d887a432e4ba8', '62d45706164eb15f5706c218']
  // TODO: call the getAllquestionIds() in question services
  const questions = ['12345678901234567890aaa1', '12345678901234567890aaa2']

  const promises = []

  for (let i = 0; i < users.length; i++) {
    console.log("Loop 1 IT:", i)
    promises.push(
      ...questions.map((question) => {
        return getLatestScore({ user: users[i], question })
      }),
    )
  }

  console.log("before waiting")
  const results = await Promise.all(promises)
  console.log("after waiting")
  console.log(results)

  for (var i = 0; i < users.length; i++) {
    var scoreSum = 0

    for (var j = 0; j < questions.length; j++) {
      scoreSum += results[i * questions.length + j]
    }

    console.log(users[i], scoreSum)
    //await findOneAndUpdateUser({ _id: users[i] }, { score: scoreSum })
  }
}

export const updateUserdetails = async (user, userDetails) => {
  let userData

  if (userDetails.email) {
    userData = await getOneUser({ email: userDetails.email }, false)
    if (userData && userData?.id.toString() !== user._id)
      return { status: 400, message: 'Email is already taken' }
  }

  if (userDetails.name) {
    userData = await getOneUser({ name: userDetails.name }, false)
    if (userData && userData?.id.toString() !== user._id)
      return { status: 400, message: 'Name is already taken' }
  }

  return await findOneAndUpdateUser({ _id: user._id }, userDetails)
}
