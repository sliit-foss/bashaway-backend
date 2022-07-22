import bcrypt from 'bcrypt'
import { getLatestScore } from '../repository/submission'
import { findOneAndUpdateUser, getOneUser, getAllUserIds } from '../repository/user'
import { getAllQuestionIds } from '../repository/question'

export const updateScoreService = async (user) => {
  const questions = getAllQuestionIds()

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
  const users = await getAllUserIds({ role: 'GROUP' })
  const questions = await getAllQuestionIds()

  const promises = []

  for (let i = 0; i < users.length; i++) {
    promises.push(
      ...questions.map((question) => {
        return getLatestScore({ user: users[i], question })
      }),
    )
  }

  const results = await Promise.all(promises)

  for (var i = 0; i < users.length; i++) {
    var scoreSum = 0

    for (var j = 0; j < questions.length; j++) {
      scoreSum += results[i * questions.length + j]
    }

    await findOneAndUpdateUser({ _id: users[i] }, { score: scoreSum })
  }
}

export const changePasswordService = async (user, oldPassword, newPassword) => {
  const isPasswordMatch = await new Promise((resolve, reject) => {
    bcrypt.compare(oldPassword, user.password, (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
  if (!isPasswordMatch) return { status: 400, message: 'Invalid current password' }

  const encryptedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
  return await findOneAndUpdateUser({ email: user.email }, { password: encryptedPassword })
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
