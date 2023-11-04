import { compareSync, hashSync } from 'bcryptjs';
import { default as createError } from 'http-errors';
import { roles } from '@/models/user';
import { getRoundBreakpoint } from '@/repository/settings';
import * as userRepository from '@/repository/user';
import { sendAdminPasswordEmail } from './util';

export const retrieveAll = (query) => userRepository.findAll(query);

export const retrieve = async (id) => {
  const user = await userRepository.findOne({ _id: id });
  if (!user) throw new createError(404, 'Invalid user ID');
  return user;
};

export const changePassword = async (user, oldPassword, newPassword) => {
  user = await userRepository.findOne({ _id: user._id }, true);
  const isPasswordMatch = compareSync(oldPassword, user.password);
  if (!isPasswordMatch) throw new createError(400, 'Invalid current password');
  const hashedPassword = hashSync(newPassword);
  return userRepository.findOneAndUpdate({ email: user.email }, { password: hashedPassword });
};

export const update = async (userId, user, payload) => {
  if (user.role !== 'SuperAdmin') {
    if (userId !== user._id.toString()) {
      throw new createError(403, 'You are not authorized to update this user');
    }
    delete payload.is_active;
    delete payload.eliminated;
  }
  if (payload.name) {
    const existingUser = await userRepository.findOne({ name: payload.name, _id: { $ne: userId } });
    if (existingUser) throw new createError(422, 'Name is already taken');
  }
  const updatedUser = await userRepository.findOneAndUpdate({ _id: userId }, payload);
  if (!updatedUser) throw new createError(404, 'Invalid user ID');
  return updatedUser;
};

export const create = async (payload) => {
  const generatedPassword = Math.random().toString(36).slice(-8);
  const encryptedPassword = hashSync(generatedPassword);
  const newUser = await userRepository.create({
    ...payload,
    password: encryptedPassword,
    is_verified: true,
    role: 'SuperAdmin'
  });
  try {
    await sendAdminPasswordEmail(payload.email, generatedPassword);
    return newUser;
  } catch (e) {
    userRepository.findOneAndRemove({ email: payload.email }).exec();
    throw e;
  }
};

export const eliminateTeams = async (vanguard) => {
  const roundBreakpoint = await getRoundBreakpoint();
  const leaderboard = await userRepository.getLeaderboard({ created_at: { $lte: roundBreakpoint } });
  const teams = leaderboard.slice(0, vanguard).map((team) => team.email);
  await Promise.all([
    userRepository.findAndUpdate({ role: roles.entrant, email: { $in: teams } }, { eliminated: false }),
    userRepository.findAndUpdate({ role: roles.entrant, email: { $nin: teams } }, { eliminated: true })
  ]);
};
