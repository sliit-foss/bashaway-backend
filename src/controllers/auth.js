import fs from 'fs';
import handlebars from 'handlebars';
import { default as createError } from 'http-errors';
import { default as path } from 'path';
import * as tokenRepository from '@/repository/token';
import * as userRepository from '@/repository/user';
import * as authService from '@/services/auth';
import { makeResponse, sendRefreshTokenResponse, sendTokenResponse } from '@/utils';

export const register = async (req, res) => {
  if (req.user) throw new createError(400, "You've already registered for an account.");
  await authService.register(req.body);
  return makeResponse({
    res,
    message: 'Registration Successfull. Please check your email to verify your account.'
  });
};

export const login = async (req, res) => {
  const user = await authService.login(req.body);
  if (!user) throw new createError(401, 'Invalid email or password');
  if (!user.is_verified) throw new createError(401, 'Account not verified. Please check your email');
  if (!user.is_active)
    throw new createError(401, 'Your account has been deactivated. Please contact an admin to resolve it');
  return sendTokenResponse(res, user, 'Logged in successfully');
};

export const verifyUser = async (req, res) => {
  const user = await authService.updateVerificationStatus(req.params.verification_code);
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
  const user = await userRepository.findOne({ email: req.body.email });
  if (user.is_verified) throw new createError(400, 'User already verified');
  await authService.authResendVerification(req.body.email);
  return makeResponse({ res, message: 'Verification email sent successfully' });
};

export const current = (req, res) => {
  return makeResponse({ res, data: req.user, message: 'Auth user details fetched successfully' });
};

export const forgotPassword = async (req, res) => {
  await authService.sendForgotPasswordEmail(req.body.email);
  return makeResponse({
    res,
    message: 'A password registration link has been emailed to you. Please use it to reset your password'
  });
};

export const resetPassword = async (req, res) => {
  await authService.resetPassword(req.body.new_password, req.params.verification_code);
  return makeResponse({ res, message: 'Password reset successfully' });
};

export const refresh = async (req, res) => {
  const userByToken = await authService.findUserByToken(req.body.refresh_token);
  if (!userByToken) throw new createError(401, 'Invalid refresh token');
  return sendRefreshTokenResponse(res, userByToken, 'Token refreshed successfully');
};

export const logout = (req, res) => {
  tokenRepository.blacklist(req.user_token);
  return makeResponse({ res, message: 'Logout successfull' });
};
