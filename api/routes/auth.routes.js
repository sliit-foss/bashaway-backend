import express from 'express';
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
} from '@/validations/auth';

const auth = express.Router();

auth.post('/login', celebrate({ [Segments.BODY]: loginSchema }), tracedAsyncHandler(login));
auth.post('/register', celebrate({ [Segments.BODY]: registerSchema }), tracedAsyncHandler(register));
auth.get('/current', protect, tracedAsyncHandler(current));
auth.post('/verify', celebrate({ [Segments.BODY]: resendVerifyMailSchema }), tracedAsyncHandler(resendVerification));
auth.get('/verify/:verification_code', celebrate({ [Segments.PARAMS]: verifySchema }), tracedAsyncHandler(verifyUser));
auth.post('/forgot_password', celebrate({ [Segments.BODY]: forgotPasswordSchema }), tracedAsyncHandler(forgotPassword));
auth.post(
  '/reset_password/:verification_code',
  celebrate({ [Segments.PARAMS]: validUserResetPasswordSchema, [Segments.BODY]: resetPasswordSchema }),
  tracedAsyncHandler(resetPassword)
);
auth.post('/refresh', celebrate({ [Segments.BODY]: refreshTokenSchema }), tracedAsyncHandler(refresh));
auth.post('/logout', protect, tracedAsyncHandler(logout));

export default auth;
