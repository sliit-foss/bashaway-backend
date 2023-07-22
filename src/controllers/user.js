import createError from 'http-errors';
import {
  addNewUser,
  changePasswordService,
  getUserByID,
  getUsers,
  updateAllScoresService,
  updateScoreService,
  updateUserdetails
} from '@/services/user';
import { makeResponse } from '@/utils/response';

export const create = async (req, res) => {
  const user = await addNewUser(req.body);
  return makeResponse({ res, data: user, message: 'User added successfully' });
};

export const getAll = async (req, res) => {
  const users = await getUsers(req.query);
  return makeResponse({ res, data: users, message: 'Users retrieved succesfully' });
};

export const getById = async (req, res) => {
  const user = await getUserByID(req.params.id);
  return makeResponse({ res, data: user, message: 'User retrieved succesfully' });
};

export const update = async (req, res) => {
  const user = await updateUserdetails(req.params.id, req.user, req.body);
  return makeResponse({ res, data: user, message: 'User updated successfully' });
};

export const updateScore = async (req, res) => {
  const result = await updateScoreService(req.params.id);
  if (!result) {
    throw new createError(404, 'Invalid user ID');
  }
  return makeResponse({ res, message: 'User score updated' });
};

export const updateAllScores = async (req, res) => {
  await updateAllScoresService();
  return makeResponse({ res, message: "All User's scores updated" });
};

export const changePassword = async (req, res) => {
  await changePasswordService(req.user, req.body.old_password, req.body.new_password);
  return makeResponse({ res, message: 'Password changed successfully' });
};
