import crypto from 'crypto';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { sendMail } from './email';
import { createUser, findOneAndUpdateUser, getOneUser } from '@/repository/user';
import { decodeJwtToken } from '@/utils';

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
    verify_url: `${process.env.APP_DOMAIN}/api/auth/verify/${verification_code}`
  };
  const attachments = [
    {
      filename: 'bashawayLogo',
      path: `${global.__basedir}/html/images/bashawayLogo.png`,
      cid: 'bashawayLogo'
    },
    {
      filename: 'fossLogo',
      path: `${global.__basedir}/html/images/fossLogo.png`,
      cid: 'fossLogo'
    }
  ];
  const subject = 'Welcome to the Bashaway';
  await sendMail(email, 'verifyRegistration', replacements, subject, attachments);
  return true;
};

export const updateVerificationStatus = async (verificationCode) => {
  const user = await getOneUser({ verification_code: verificationCode });
  if (!user) return false;
  return findOneAndUpdateUser({ email: user.email }, { is_verified: true });
};

export const authResendVerification = async (email) => {
  const user = await getOneUser({ email });
  if (!user) throw new createError(400, 'A user/group by the provided email does not exist');
  const verification_code = crypto.randomUUID();
  const updatedUser = await findOneAndUpdateUser({ email }, { verification_code });
  await verifyMailTemplate(email, verification_code);
  return updatedUser;
};

export const resetPasswordMailTemplate = async (email, verification_code) => {
  const replacements = {
    reset_url: `${
      process.env.FRONTEND_DOMAIN || 'https://portal.bashaway.sliitfoss.org'
    }/reset-password/${verification_code}`
  };
  const attachments = [
    {
      filename: 'bashawayLogo',
      path: `${global.__basedir}/html/images/bashawayLogo.png`,
      cid: 'bashawayLogo'
    },
    {
      filename: 'fossLogo',
      path: `${global.__basedir}/html/images/fossLogo.png`,
      cid: 'fossLogo'
    }
  ];
  const subject = 'Bashaway - Reset Account Password';
  await sendMail(email, 'resetPassword', replacements, subject, attachments);
  return true;
};

export const forgotPasswordEmail = async (email) => {
  const user = await getOneUser({ email });
  if (!user) throw new createError(400, 'A user/group by the provided email does not exist');
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
