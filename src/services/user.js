import bcrypt from 'bcrypt'
import { getLatestScore } from '../repository/submission'
import { changePassword, findOneAndUpdateUser, getOneUser } from '../repository/user'

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
