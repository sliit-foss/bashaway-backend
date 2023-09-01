import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import { createUser, findOneAndRemoveUser, findOneAndUpdateUser, getAllUsers, getOneUser } from '@/repository/user';
import { sendMail } from './email';

export const getUsers = (query) => {
  return getAllUsers(query);
};

export const getUserByID = async (id) => {
  const user = await getOneUser({ _id: id });
  if (!user) throw new createError(404, 'Invalid user ID');
  return user;
};

export const changePasswordService = async (user, oldPassword, newPassword) => {
  user = await getOneUser({ _id: user._id }, true); // because req.user doesn't have the password

  const isPasswordMatch = await new Promise((resolve, reject) => {
    bcrypt.compare(oldPassword, user.password, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  if (!isPasswordMatch) throw new createError(400, 'Invalid current password');

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
      throw new createError(403, 'You are not authorized to update this user');
    }
    delete userDetails.is_active;
  }

  if (userDetails.name) {
    userData = await getOneUser({ name: userDetails.name }, false);
    if (userData && userData?._id.toString() !== userId.toString()) throw new createError(422, 'Name is already taken');
  }

  const updatedUser = await findOneAndUpdateUser({ _id: userId }, userDetails);
  if (!updatedUser) throw new createError(422, 'Invalid user ID');

  return updatedUser;
};

export const addNewUser = async (userDetails) => {
  const generatedPassword = Math.random().toString(36).slice(-8);

  const encryptedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(generatedPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, hash) => {
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

  if (newUser) sendEmail = await sendAdminPassword(userDetails.email, generatedPassword);

  if (!sendEmail) {
    await findOneAndRemoveUser({ email: userDetails.email });
    return;
  }

  return newUser;
};

const sendAdminPassword = (email, password) => {
  const replacements = {
    header: 'Welcome To Bashaway!',
    text: `Congratulations on being added as an admin to the Bashaway admin portal. To login to the system you
    can use the following password - <span style="color: #ff0000">${password}</span>`,
    action_link: `${process.env.ADMIN_FRONTEND_DOMAIN || 'https://admin.bashaway.sliitfoss.org'}/login`,
    action_text: 'Login',
    disclaimer_text: "You've received this email because you have been chosen as a member of Bashaway 2023."
  };
  const subject = 'Bashaway - Admin Account Password';
  return sendMail(email, 'call_to_action', replacements, subject);
};
