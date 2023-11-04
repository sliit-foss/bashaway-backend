import { compareSync, hashSync } from 'bcryptjs';
import { default as crypto } from 'crypto';
import { default as createError } from 'http-errors';
import * as userRepository from '@/repository/user';
import { decodeJwtToken } from '@/utils';
import { sendResetPasswordEmail, sendVerificationEmail } from './util';

export const register = async ({ email, password, ...payload }) => {
  password = hashSync(password);
  const verification_code = crypto.randomUUID();
  const registeredUser = await userRepository.create({
    email,
    password,
    verification_code: verification_code,
    ...payload
  });
  await sendVerificationEmail(email, verification_code);
  return registeredUser;
};

export const login = async ({ email, password }) => {
  const user = await userRepository.findOne({ email }, true);
  if (!user) return false;
  const isPasswordMatch = compareSync(password, user.password);
  if (!isPasswordMatch) return false;
  delete user.password;
  return user;
};

export const updateVerificationStatus = async (verificationCode) => {
  const user = await userRepository.findOne({ verification_code: verificationCode });
  if (!user) return false;
  return userRepository.findOneAndUpdate({ email: user.email }, { is_verified: true, verification_code: null });
};

export const authResendVerification = async (email) => {
  const user = await userRepository.findOne({ email });
  if (!user) throw new createError(400, 'A user by the provided email does not exist');
  const verification_code = crypto.randomUUID();
  const updatedUser = await userRepository.findOneAndUpdate({ email }, { verification_code });
  await sendVerificationEmail(email, verification_code);
  return updatedUser;
};

export const sendForgotPasswordEmail = async (email) => {
  const user = await userRepository.findOne({ email });
  if (!user) throw new createError(400, `A user by the provided email does not exist`);
  const verification_code = crypto.randomUUID();
  const updatedUser = await userRepository.findOneAndUpdate({ email }, { verification_code });
  await sendResetPasswordEmail(email, verification_code);
  return updatedUser;
};

export const resetPassword = async (password, verificationCode) => {
  const user = await userRepository.findOne({ verification_code: verificationCode });
  if (!user) throw new createError(400, 'Click the link we have sent to your email and try again.');
  const hashedPassword = hashSync(password);
  const updatedUser = await userRepository.findOneAndUpdate(
    { email: user.email },
    { password: hashedPassword, is_verified: true, verification_code: null }
  );
  return updatedUser;
};

export const findUserByToken = async (token) => {
  const decodedUser = decodeJwtToken(token).data;
  const user = decodedUser ? await userRepository.findOne({ _id: decodedUser._id }, false) : null;
  return user;
};
