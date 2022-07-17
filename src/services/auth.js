import bcrypt from 'bcrypt'
import {log} from 'console'
const fs = require('fs')
import { v4 as uuidv4 } from 'uuid'
import { createUser, getOneUser, findOneAndUpdateUser } from '../repository/user'
import { sendMail } from './email'

export const authRegister = async ({ name, email, password, university, members }) => {
  const user = await getOneUser({ email })
  if (user) return { status: 400, message: 'User already exists' }
  const encryptedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
  const verification_code = uuidv4()
  const registeredUser = await createUser({
    name,
    email,
    password: encryptedPassword,
    verification_code: verification_code,
    university,
    members,
  })
  await verifyMailTemplate(email, verification_code)
  return registeredUser
}

export const authLogin = async ({ email, password }) => {
  const user = await getOneUser({ email })
  if (!user) return false
  const isPasswordMatch = await new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
  if (!isPasswordMatch) return false
  return user
}

export const verifyMailTemplate = async (email, verification_code) => {
  const replacements = {
    verify_URL: `${process.env.APP_DOMAIN}/api/auth/verify/${verification_code}`,
  }
  const subject = 'Welcome to the Bashaway'
  await sendMail(email, 'verifyRegistration', replacements, subject)
  return true
}

export const updateVerificationStatus = async (verificationCode) => {
  const user = await getOneUser({ verification_code: verificationCode })
  if (!user) return false
  return await findOneAndUpdateUser({ email: user.email }, { is_verified: true })
}
