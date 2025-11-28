import { compareSync, hashSync } from 'bcryptjs';
import { default as createError } from 'http-errors';
import { ROLE } from '@/constants';
import { getRoundBreakpoint } from '@/repository/settings';
import {
  createUser,
  findAndUpdateUsers,
  findOneAndRemoveUser,
  findOneAndUpdateUser,
  getAllUsers,
  getLeaderboardData,
  getOneUser
} from '@/repository/user';
import { sendMail } from './email';

export const getUsers = (query) => getAllUsers(query);

export const getUserByID = async (id) => {
  const user = await getOneUser({ _id: id });
  if (!user) throw new createError(404, 'Invalid user ID');
  return user;
};

export const changePasswordService = async (user, oldPassword, newPassword) => {
  user = await getOneUser({ _id: user._id }, true); // because req.user doesn't have the password
  const isPasswordMatch = compareSync(oldPassword, user.password);
  if (!isPasswordMatch) throw new createError(400, 'Invalid current password');
  const hashedPassword = hashSync(newPassword, +process.env.BCRYPT_SALT_ROUNDS);
  return findOneAndUpdateUser({ email: user.email }, { password: hashedPassword });
};

export const updateUserdetails = async (userId, user, payload) => {
  if (user.role !== ROLE.ADMIN) {
    if (userId !== user._id.toString()) {
      throw new createError(403, 'You are not authorized to update this user');
    }
    delete payload.is_active;
    delete payload.eliminated;
    delete payload.name;
  }
  if (payload.name) {
    const existingUser = await getOneUser({ name: payload.name, _id: { $ne: userId } });
    if (existingUser) throw new createError(422, 'Name is already taken');
  }
  const updatedUser = await findOneAndUpdateUser({ _id: userId }, payload);
  if (!updatedUser) throw new createError(404, 'Invalid user ID');
  return updatedUser;
};

export const addNewUser = async (payload) => {
  const generatedPassword = Math.random().toString(36).slice(-8);
  const encryptedPassword = hashSync(generatedPassword, +process.env.BCRYPT_SALT_ROUNDS);
  const newUser = await createUser({
    ...payload,
    password: encryptedPassword,
    is_verified: true
  });
  try {
    await sendUserPassword(payload.email, generatedPassword, payload.role);
    return newUser;
  } catch (e) {
    findOneAndRemoveUser({ email: payload.email });
    throw e;
  }
};

const sendUserPassword = (email, password, role) => {
  const replacements = {
    header: 'Welcome To Bashaway!',
    text: `Congratulations on being added as ${
      role === ROLE.ADMIN ? `an` : `a`
    } ${role} to the Bashaway admin portal. To login to the system you can use the following password -`,
    highlight_text: password,
    action_link: `${process.env.ADMIN_FRONTEND_DOMAIN || 'https://admin.bashaway.sliitfoss.org'}/login`,
    action_text: 'Login',
    disclaimer_text: `You've received this email because you have been chosen as a member of Bashaway ${new Date().getFullYear()}.`
  };
  const subject = 'Bashaway - Admin Account Password';
  return sendMail(email, 'call_to_action', replacements, subject);
};

export const eliminateTeams = async (vanguard) => {
  const roundBreakpoint = await getRoundBreakpoint();
  const leaderboard = await getLeaderboardData({ created_at: { $lte: roundBreakpoint } });
  const teams = leaderboard.slice(0, vanguard).map((team) => team.email);
  await Promise.all([
    findAndUpdateUsers({ role: ROLE.GROUP, email: { $in: teams } }, { eliminated: false }),
    findAndUpdateUsers({ role: ROLE.GROUP, email: { $nin: teams } }, { eliminated: true })
  ]);
};
