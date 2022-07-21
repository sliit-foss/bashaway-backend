import { getLatestScore } from '../repository/submission'
import { findOneAndUpdateUser } from '../repository/user'
import { getOneUser } from '../repository/user'
import { createUser } from '../repository/user'
import { sendMail } from './email'

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

export const updateUserdetails = async (user, userDetails) => {

  let userData;

  if (userDetails.email) {
    userData = await getOneUser({ email: userDetails.email }, false)
    if (userData && userData?.id.toString() !== user._id) return { status: 400, message: "Email is already taken" }
  }

  if (userDetails.name) {
    userData = await getOneUser({ name: userDetails.name }, false)
    if (userData && userData?.id.toString() !== user._id) return { status: 400, message: "Name is already taken" }
  }

  return await findOneAndUpdateUser({ _id: user._id }, userDetails)

}

export const addnewUser = async (userDetails) => {

  const genaratedPassword = Math.random().toString(36).slice(-8)
  let user;
  let newUser;

  if (userDetails.email) {
    user = await getOneUser({ email: userDetails.email }, false)
    if (user && user?._id.toString() !== userDetails._id) return { status: 400, message: "Email is already taken" }
  }

  if (userDetails.name) {
    user = await getOneUser({ name: userDetails.name }, false)
    if (user && user?._id.toString() !== userDetails._id) return { status: 400, message: "Name is already taken" }
  }

  const sendemail = SendAdminpassword(userDetails.email , genaratedPassword)  
  
  if(sendemail)
    newUser = await createUser ({...userDetails , password:genaratedPassword , is_verified:true , role:"ADMIN" })

  return newUser
}

const SendAdminpassword = async (email , password) => {
  const replacements = {
    GenaratedPassword: password,
  }
  const subject = 'Welcome to the Bashaway'
  await sendMail(email, 'SendAdminPassword', replacements, subject)
  return true
}

