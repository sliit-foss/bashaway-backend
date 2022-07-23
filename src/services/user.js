import bcrypt from 'bcrypt'
import { getLatestScore } from '../repository/submission'
import { findOneAndUpdateUser, findOneAndRemoveUser, getOneUser, createUser, getAllUserIds } from '../repository/user'
import { getAllQuestionIds } from '../repository/question'
import { sendMail } from './email'

export const updateScoreService = async (user) => {
  const questions = getAllQuestionIds()

  const result = await Promise.all(
    questions.map((question) => {
      return getLatestScore({ user, question })
    }),
  )
  const scoreSum = result.reduce((acc, current) => current + acc, 0)

  return await findOneAndUpdateUser({ _id: user }, { score: scoreSum })
}

export const updateAllScoresService = async () => {
  const users = await getAllUserIds({ role: 'GROUP' })
  const questions = await getAllQuestionIds()

  const promises = []

  for (let user of users) {
    let userScores = await Promise.all(
      questions.map((question) => {
        return getLatestScore({ user, question })
      }),
    )
    let userSum = userScores.reduce((acc, current) => acc + current, 0)
    promises.push(findOneAndUpdateUser({ _id: user }, { score: userSum }))
  }

  Promise.all(promises)
  return
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

export const addNewUser = async (userDetails) => {

  const genaratedPassword = Math.random().toString(36).slice(-8)

  const user = await getOneUser({ email: userDetails.email }, false)
  if (user && user?._id.toString() !== userDetails._id) return { status: 400, message: "Email is already taken" }

  const encryptedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(genaratedPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })

  const newUser = await createUser({ ...userDetails, password: encryptedPassword, is_verified: true, role: "ADMIN" })

  let sendEmail;

  if (newUser)
    sendEmail = await sendAdminPassword(userDetails.email, genaratedPassword)

  if (!sendEmail) {
    await findOneAndRemoveUser({ email: userDetails.email })
    return
  }

  return newUser
}

const sendAdminPassword = async (email, password) => {
  const replacements = {
    genaratedPassword: password,
  }
  const subject = 'Welcome to the Bashaway'
  return await sendMail(email, 'sendAdminPassword', replacements, subject)
}
