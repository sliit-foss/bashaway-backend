import {
  loginSchema,
  registerSchema,
  resendVerifyMailSchema,
  resetPasswordSchema,
  validUserResetPasswordSchema,
  verifySchema
} from '@/validations/user';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { Segments, celebrate } from 'celebrate';
import {
  current,
  forgotPassword,
  login,
  register,
  resendVerification,
  resetPassword,
  verifyUser
} from '@/controllers/auth';
import { protect } from '@/middleware/auth';

const authRouter = express.Router();

const verifyEmailLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 2, // 2 requests per 1 minute allowed
  standardHeaders: true,
  legacyHeaders: false
});

authRouter.post('/login', celebrate({ [Segments.BODY]: loginSchema }), login);
authRouter.post('/register', celebrate({ [Segments.BODY]: registerSchema }), register);
authRouter.get('/current', protect, current);
authRouter.post(
  '/verify',
  celebrate({ [Segments.BODY]: resendVerifyMailSchema }),
  verifyEmailLimiter,
  resendVerification
);
authRouter.get('/verify/:verification_code', celebrate({ [Segments.PARAMS]: verifySchema }), verifyUser);
authRouter.post('/forgot_password', forgotPassword);
authRouter.post(
  '/reset_password/:verification_code',
  celebrate({ [Segments.PARAMS]: validUserResetPasswordSchema, [Segments.BODY]: resetPasswordSchema }),
  resetPassword
);

export default authRouter;
