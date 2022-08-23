import express from 'express'
import { celebrate, Segments } from 'celebrate'
import { login, register, current, verifyUser, resendVerification, forgotPassword, resetPassword } from '../controllers/auth'
import { registerSchema, loginSchema, verifySchema, resendVerifyMailSchema, validUserResetPasswordSchema, resetPasswordSchema } from '../validations/user'
import { protect } from '../middleware/auth'
import rateLimit from 'express-rate-limit'

const authRouter = express.Router()

const verifyEmailLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 2, // 2 requests per 1 minute allowed
  standardHeaders: true,
  legacyHeaders: false
})

authRouter.post('/login', celebrate({ [Segments.BODY]: loginSchema }), login)
authRouter.post('/register', celebrate({ [Segments.BODY]: registerSchema }), register)
authRouter.get('/current', protect, current)
authRouter.post('/verify', celebrate({ [Segments.BODY]: resendVerifyMailSchema }), verifyEmailLimiter, resendVerification)
authRouter.get('/verify/:verification_code', celebrate({ [Segments.PARAMS]: verifySchema }), verifyUser)
authRouter.post('/forgot_password', forgotPassword)
authRouter.post('/reset_password/:verification_code', celebrate({ [Segments.PARAMS]: validUserResetPasswordSchema, [Segments.BODY]: resetPasswordSchema }), resetPassword)

export default authRouter
