import bcrypt from 'bcrypt'
import { getLatestScore } from '../repository/submission'
import {
  findOneAndUpdateUser,
  findOneAndRemoveUser,
  getOneUser,
  createUser,
  getAllUserIds,
  getAllUsers,
} from '../repository/user'
import { getAllQuestionIds } from '../repository/question'
import { sendMail } from './email'

export const updateScoreService = async (user) => {
  const questions = await getAllQuestionIds()

  const result = await Promise.all(
    questions.map((question) => {
      return getLatestScore({ user, question })
    }),
  )
  const scoreSum = result.reduce((acc, current) => current + acc, 0)

  return await findOneAndUpdateUser({ _id: user }, { score: scoreSum })
}

export const getUsers = async (query) => {
  return await getAllUsers(query)
}

export const getUserByID = async (id) => {
  const user = await getOneUser({ _id: id })
  if (!user)
    return {
      status: 422,
      message: 'Invalid submission ID',
    }
  return user
}

export const updateAllScoresService = async () => {
  const users = await getAllUserIds({ role: 'GROUP' })
  const questions = await getAllQuestionIds()

  return await Promise.all(
    users.map(async (user) => {
      let userSum = 0
      await Promise.all(
        questions.map(async (question) => {
          return getLatestScore({ user, question }).then((score) => {
            userSum += score
          })
        }),
      )
      return findOneAndUpdateUser({ _id: user }, { score: userSum })
    }),
  )
}

export const changePasswordService = async (user, oldPassword, newPassword) => {
  user = await getOneUser({ _id: user._id }, true) // because req.user doesn't have the password

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

export const updateUserdetails = async (userId, user, userDetails) => {
  let userData

  if (user.role !== 'ADMIN' && userId.toString() !== user._id.toString())
    return { status: 403, message: "You are not authorized to update this user" }


  if (userDetails.name) {
    userData = await getOneUser({ name: userDetails.name }, false)
    if (userData && (userData?._id.toString() !== userId.toString()))
      return { status: 422, message: 'Name is already taken' }
  }

  const updatedUser = await findOneAndUpdateUser({ _id: userId }, userDetails)
  if (!updatedUser) return {
    status: 422,
    message: 'Invalid user ID'
  }
  return updatedUser
}

export const addNewUser = async (userDetails) => {
  const genaratedPassword = Math.random().toString(36).slice(-8)

  let user = await getOneUser({ email: userDetails.email }, false)

  if (user?._id.toString() !== userDetails._id)
    return { status: 400, message: 'Email is already taken' }

  user = await getOneUser({ name: userDetails.name }, false)

  if (user?.name === userDetails.name)
    return { status: 400, message: 'Admin names must be unique' }


  const encryptedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(genaratedPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })

  const newUser = await createUser({
    ...userDetails,
    password: encryptedPassword,
    is_verified: true,
    role: 'ADMIN',
  })

  let sendEmail

  if (newUser) sendEmail = await sendAdminPassword(userDetails.email, genaratedPassword)

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
