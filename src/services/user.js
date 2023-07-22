import { getAllQuestionIds } from '../repository/question';
import { getLatestScore } from '../repository/submission';
import {
  createUser,
  findOneAndRemoveUser,
  findOneAndUpdateUser,
  getAllUserIds,
  getAllUsers,
  getOneUser
} from '../repository/user';
import { sendMail } from './email';
import bcrypt from 'bcrypt';

export const updateScoreService = async (user) => {
  const questions = await getAllQuestionIds();

  const result = await Promise.all(
    questions.map((question) => {
      return getLatestScore({ user, question });
    })
  );
  const scoreSum = result.reduce((acc, current) => current + acc, 0);

  return findOneAndUpdateUser({ _id: user }, { score: scoreSum });
};

export const getUsers = (query) => {
  return getAllUsers(query);
};

export const getUserByID = async (id) => {
  const user = await getOneUser({ _id: id });
  if (!user)
    return {
      status: 422,
      message: 'Invalid submission ID'
    };
  return user;
};

export const updateAllScoresService = async () => {
  const users = await getAllUserIds({ role: 'GROUP' });
  const questions = await getAllQuestionIds();

  return Promise.all(
    users.map(async (user) => {
      let userSum = 0;
      await Promise.all(
        questions.map((question) => {
          return getLatestScore({ user, question }).then((score) => {
            userSum += score;
          });
        })
      );
      return findOneAndUpdateUser({ _id: user }, { score: userSum });
    })
  );
};

export const changePasswordService = async (user, oldPassword, newPassword) => {
  user = await getOneUser({ _id: user._id }, true); // because req.user doesn't have the password

  const isPasswordMatch = await new Promise((resolve, reject) => {
    bcrypt.compare(oldPassword, user.password, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  if (!isPasswordMatch) return { status: 400, message: 'Invalid current password' };

  const encryptedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return findOneAndUpdateUser({ email: user.email }, { password: encryptedPassword });
};

export const updateUserdetails = async (userId, user, userDetails) => {
  let userData;

  if (user.role !== 'ADMIN') {
    if (userId.toString() !== user._id.toString()) {
      return { status: 403, message: 'You are not authorized to update this user' };
    }
    delete userDetails.is_active;
  }

  if (userDetails.name) {
    userData = await getOneUser({ name: userDetails.name }, false);
    if (userData && userData?._id.toString() !== userId.toString())
      return { status: 422, message: 'Name is already taken' };
  }

  const updatedUser = await findOneAndUpdateUser({ _id: userId }, userDetails);
  if (!updatedUser)
    return {
      status: 422,
      message: 'Invalid user ID'
    };
  return updatedUser;
};

export const addNewUser = async (userDetails) => {
  const genaratedPassword = Math.random().toString(36).slice(-8);

  const encryptedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(genaratedPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });

  const newUser = await createUser({
    ...userDetails,
    password: encryptedPassword,
    is_verified: true,
    role: 'ADMIN'
  });

  let sendEmail;

  if (newUser) sendEmail = await sendAdminPassword(userDetails.email, genaratedPassword);

  if (!sendEmail) {
    await findOneAndRemoveUser({ email: userDetails.email });
    return;
  }

  return newUser;
};

const sendAdminPassword = (email, password) => {
  const replacements = {
    genaratedPassword: password,
    adminFrontendDomain: process.env.ADMIN_FRONTEND_DOMAIN || 'https://admin.bashaway.sliitfoss.org'
  };
  const subject = 'Welcome to the Bashaway';
  return sendMail(email, 'sendAdminPassword', replacements, subject);
};
