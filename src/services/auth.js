import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import createError from 'http-errors';
import { createUser, findOneAndUpdateUser, getOneUser } from '@/repository/user';
import { decodeJwtToken, isFromAdmin } from '@/utils';
import { sendMail } from './email';

export const authRegister = async ({ name, email, password, university, members }) => {
  const encryptedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  const verification_code = crypto.randomUUID();
  const registeredUser = await createUser({
    name,
    email,
    password: encryptedPassword,
    verification_code: verification_code,
    university,
    members
  });
  await verifyMailTemplate(email, verification_code);
  return registeredUser;
};

export const authLogin = async ({ email, password }) => {
  const user = await getOneUser({ email }, true);
  if (!user) return false;
  const isPasswordMatch = await new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  if (!isPasswordMatch) return false;
  delete user.password;
  return user;
};

export const verifyMailTemplate = async (email, verification_code) => {
  const replacements = {
    header: 'Welcome To Bashaway!',
    text: `We are excited to have you here. To get started, you need to confirm your account. Just press the
    button below.`,
    action_link: `${process.env.APP_DOMAIN}/api/auth/verify/${verification_code}`,
    action_text: 'Confirm',
    disclaimer_text: "You've received this email because you have opted to participate in Bashaway 2023."
  };
  const subject = 'Bashaway - Account Verification';
  await sendMail(email, 'call_to_action', replacements, subject);
  return true;
};

export const updateVerificationStatus = async (verificationCode) => {
  const user = await getOneUser({ verification_code: verificationCode });
  if (!user) return false;
  return findOneAndUpdateUser({ email: user.email }, { is_verified: true, verification_code: null });
};

export const authResendVerification = async (email) => {
  const user = await getOneUser({ email });
  if (!user) throw new createError(400, 'A team by the provided email does not exist');
  const verification_code = crypto.randomUUID();
  const updatedUser = await findOneAndUpdateUser({ email }, { verification_code });
  await verifyMailTemplate(email, verification_code);
  return updatedUser;
};

export const resetPasswordMailTemplate = async (email, verification_code) => {
  const replacements = {
    header: 'Hello!',
    text: `We’ve received your request to change your password. Use the link below to set up a new password for
    your account. This link is only usable once! If you need to, you can reinitiate the password process
    at the login page.`,
    action_link: `${
      isFromAdmin() ? process.env.ADMIN_FRONTEND_DOMAIN : process.env.FRONTEND_DOMAIN
    }/reset-password/${verification_code}`,
    action_text: 'Reset Password',
    disclaimer_text: "You've received this email because you have opted to participate in Bashaway 2023."
  };
  const subject = 'Bashaway - Reset Account Password';
  await sendMail(email, 'call_to_action', replacements, subject);
  return true;
};

export const forgotPasswordEmail = async (email) => {
  const user = await getOneUser({ email });
  if (!user) throw new createError(400, `A ${isFromAdmin() ? 'user' : 'team'} by the provided email does not exist`);
  const verification_code = crypto.randomUUID();
  const updatedUser = await findOneAndUpdateUser({ email }, { verification_code });
  await resetPasswordMailTemplate(email, verification_code);
  return updatedUser;
};

export const resetPasswordFromEmail = async (password, verificationCode) => {
  const user = await getOneUser({ verification_code: verificationCode });
  if (!user) throw new createError(400, 'Click the link we have sent to your email and try again.');
  const encryptedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  const updatedUser = await findOneAndUpdateUser(
    { email: user.email },
    { password: encryptedPassword, is_verified: true }
  );
  return updatedUser;
};

export const getUserByToken = async (token) => {
  const decodedUser = decodeJwtToken(token).data;
  const user = decodedUser ? await getOneUser({ _id: decodedUser._id }, false) : null;
  return user;
};
