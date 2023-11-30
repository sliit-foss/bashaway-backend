import fs from 'fs';
import handlebars from 'handlebars';
import { default as createError } from 'http-errors';
import path from 'path';
import { getRegistrationDeadline } from '@/repository/settings';
import { blacklistToken } from '@/repository/token';
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
import { makeResponse, sendRefreshTokenResponse, sendTokenResponse } from '@/utils';

export const register = async (req, res) => {
  if (new Date() >= new Date(await getRegistrationDeadline())) throw new createError(400, 'Registration closed');
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
    throw new createError(401, 'Your account has been deactivated. Please contact an admin to resolve it');
  return sendTokenResponse(res, user, 'User logged in successfully');
};

export const verifyUser = async (req, res) => {
  const user = await updateVerificationStatus(req.params.verification_code);
  try {
    const template = handlebars.compile(fs.readFileSync(path.join(__dirname, `../html/verification.html`), 'utf8'));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
      template({
        login_link: `${process.env.FRONTEND_DOMAIN}/login`,
        verified: !!user
      })
    );
  } catch (e) {
    res.writeHead(404);
    res.end('Failed to load html content!');
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
  const userByToken = await getUserByToken(req.body.refresh_token);
  if (!userByToken) throw new createError(401, 'Invalid refresh token');
  return sendRefreshTokenResponse(res, userByToken, 'Token refreshed successfully');
};

export const logout = (req, res) => {
  blacklistToken(req.user_token);
  return makeResponse({ res, message: 'Logout successfull' });
};
