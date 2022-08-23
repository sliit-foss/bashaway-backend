import asyncHandler from '../middleware/async'
import { authRegister, authLogin, updateVerificationStatus, authResendVerification, forgotPasswordEmail, resetPasswordFromEmail } from '../services/auth'
import { getOneUser } from '../repository/user'
import { makeResponse } from '../utils/response'
import { sendTokenResponse } from '../utils/jwt'
var fs = require('fs')
export const register = asyncHandler(async (req, res) => {
  const result = await authRegister(req.body)
  if (!result) return makeResponse({ res, status: 500, message: 'Registration failed.' })
  if (result.status) return makeResponse({ res, ...result })
  return makeResponse({
    res,
    message: 'Registration Successfull. Please check your email to verify your account.'
  })
})

export const login = asyncHandler(async (req, res) => {
  const user = await authLogin(req.body)
  if (!user) return makeResponse({ res, status: 401, message: 'Invalid email or password' })
  if (!user.is_verified)
    return makeResponse({
      res,
      status: 401,
      message: 'Account not verified. Please check your email'
    })
  if (!user.is_active)
    return makeResponse({
      res,
      status: 401,
      message: 'Your account has been deactivated. Please contact a bashaway administrator to resolve it'
    })
  return sendTokenResponse(res, user, 'User logged in successfully')
})

export const verifyUser = asyncHandler(async (req, res) => {
  const user = await updateVerificationStatus(req.params.verification_code)
  if (user) {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.readFile('./src/html/verificationSuccessfully.html', null, function (error, data) {
      if (error) {
        res.write('file not found')
        res.writeHead(404)
      } else {
        res.write(data)
      }
      res.end()
    })
  } else {
    return makeResponse({ res, status: 400, message: 'Invalid verification code' })
  }
})

export const resendVerification = asyncHandler(async (req, res) => {
  const user = await getOneUser({ email: req.body.email })
  if (user.is_verified) return makeResponse({ res, status: 405, message: 'User already verified' })

  const result = await authResendVerification(req.body.email)
  if (result.status) return makeResponse({ res, ...result })
  return makeResponse({ res, message: 'Verification email sent successfully' })
})

export const current = asyncHandler(async (req, res, next) => {
  return makeResponse({ res, data: req.user, message: 'Auth group details fetched successfully' })
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await forgotPasswordEmail(req.body.email)
  if (result.status) return makeResponse({ res, ...result })
  return makeResponse({ res, message: 'A password registration link has been emailed to you. Please use it to reset your password' })
})

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await resetPasswordFromEmail(req.body.password, req.params.verification_code)
  if (result.status) return makeResponse({ res, ...result })
  return makeResponse({ res, message: 'Password reset successfully' })
})
