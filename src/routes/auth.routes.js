import express from 'express';
import rateLimit from 'express-rate-limit';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import {
  current,
  forgotPassword,
  login,
  logout,
  refresh,
  register,
  resendVerification,
  resetPassword,
  verifyUser
} from '@/controllers/auth';
import { protect } from '@/middleware/auth';
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resendVerifyMailSchema,
  resetPasswordSchema,
  validUserResetPasswordSchema,
  verifySchema
} from '@/validations/user';

const authRouter = express.Router();

const verifyEmailLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 2, // 2 requests per 1 minute allowed
  standardHeaders: true,
  legacyHeaders: false
});

authRouter.post('/login', celebrate({ [Segments.BODY]: loginSchema }), tracedAsyncHandler(login));
authRouter.post('/register', celebrate({ [Segments.BODY]: registerSchema }), tracedAsyncHandler(register));
authRouter.get('/current', protect, tracedAsyncHandler(current));
authRouter.post(
  '/verify',
  celebrate({ [Segments.BODY]: resendVerifyMailSchema }),
  verifyEmailLimiter,
  tracedAsyncHandler(resendVerification)
);
authRouter.get(
  '/verify/:verification_code',
  celebrate({ [Segments.PARAMS]: verifySchema }),
  tracedAsyncHandler(verifyUser)
);
authRouter.post(
  '/forgot_password',
  celebrate({ [Segments.BODY]: forgotPasswordSchema }),
  tracedAsyncHandler(forgotPassword)
);
authRouter.post(
  '/reset_password/:verification_code',
  celebrate({ [Segments.PARAMS]: validUserResetPasswordSchema, [Segments.BODY]: resetPasswordSchema }),
  tracedAsyncHandler(resetPassword)
);
authRouter.post('/refresh', celebrate({ [Segments.BODY]: refreshTokenSchema }), tracedAsyncHandler(refresh));
authRouter.post('/logout', protect, tracedAsyncHandler(logout));

export default authRouter;
