import createError from 'http-errors';
import { getOneUser } from '@/repository/user';
import {
  authLogin,
  authRegister,
  authResendVerification,
  forgotPasswordEmail,
  getUserByToken,
  resetPasswordFromEmail,
  updateVerificationStatus
} from '@/services/auth';
import { makeResponse, sendTokenResponse } from '@/utils';

const fs = require('fs');

const registrationEnd = new Date(2022, 8, 30, 8, 0, 0);

export const register = async (req, res) => {
  if (Date.now() >= registrationEnd.getTime()) throw new createError(400, 'Registration closed');
  if (req.user) throw new createError(400, "You've already registered for an account.");
  await authRegister(req.body);
  return makeResponse({
    res,
    message: 'Registration Successfull. Please check your email to verify your account.'
  });
};

export const login = async (req, res) => {
  const user = await authLogin(req.body);
  if (!user) throw new createError(401, 'Invalid email or password');
  if (!user.is_verified) throw new createError(401, 'Account not verified. Please check your email');
  if (!user.is_active)
    throw new createError(
      401,
      'Your account has been deactivated. Please contact a bashaway administrator to resolve it'
    );
  return sendTokenResponse(res, user, 'User logged in successfully');
};

export const verifyUser = async (req, res) => {
  const user = await updateVerificationStatus(req.params.verification_code);
  if (user) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('./src/html/verificationSuccessfull.html', null, function (error, data) {
      if (error) {
        res.write('file not found');
        res.writeHead(404);
      } else {
        res.write(data);
      }
      res.end();
    });
  } else {
    throw new createError(400, 'Invalid verification code');
  }
};

export const resendVerification = async (req, res) => {
  const user = await getOneUser({ email: req.body.email });
  if (user.is_verified) throw new createError(400, 'User already verified');
  await authResendVerification(req.body.email);
  return makeResponse({ res, message: 'Verification email sent successfully' });
};

export const current = (req, res) => {
  return makeResponse({ res, data: req.user, message: 'Auth group details fetched successfully' });
};

export const forgotPassword = async (req, res) => {
  await forgotPasswordEmail(req.body.email);
  return makeResponse({
    res,
    message: 'A password registration link has been emailed to you. Please use it to reset your password'
  });
};

export const resetPassword = async (req, res) => {
  await resetPasswordFromEmail(req.body.new_password, req.params.verification_code);
  return makeResponse({ res, message: 'Password reset successfully' });
};

export const refresh = async (req, res) => {
  const user = req.user;
  const userByToken = await getUserByToken(req.body.refresh_token);
  if (!userByToken) throw new createError(401, 'Invalid refresh token');
  if (userByToken._id.toString() !== user._id.toString()) throw new createError(401, 'Invalid refresh token');
  return sendTokenResponse(res, user, 'Token refreshed successfully');
};
