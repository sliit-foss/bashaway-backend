import asyncHandler from '../middleware/async';
import {
  addNewUser,
  changePasswordService,
  getUserByID,
  getUsers,
  updateAllScoresService,
  updateScoreService,
  updateUserdetails
} from '../services/user';
import { makeResponse } from '../utils/response';

export const create = asyncHandler(async (req, res) => {
  const result = await addNewUser(req.body);
  if (!result) return makeResponse({ res, status: 500, message: 'Failed to add user' });
  if (result.status) return makeResponse({ res, ...result });
  return makeResponse({ res, status: 200, data: result, message: 'User added successfully' });
});

export const getAll = asyncHandler(async (req, res) => {
  const users = await getUsers(req.query);
  return makeResponse({ res, status: 200, data: users, message: 'Users retrieved succesfully' });
});

export const getById = asyncHandler(async (req, res) => {
  const ret = await getUserByID(req.params.id);
  if (ret.status) return makeResponse({ res, ...ret });
  return makeResponse({ res, status: 200, data: ret, message: 'User retrieved succesfully' });
});

export const update = asyncHandler(async (req, res) => {
  const result = await updateUserdetails(req.params.id, req.user, req.body);
  if (!result) return makeResponse({ res, status: 500, message: 'Failed to update user' });
  if (result.status) return makeResponse({ res, ...result });
  return makeResponse({ res, status: 200, data: result, message: 'User updated successfully' });
});

export const updateScore = asyncHandler(async (req, res) => {
  if (await updateScoreService(req.params.id)) return makeResponse({ res, status: 200, message: 'User score updated' });
  return makeResponse({ res, status: 404, message: 'Invalid user ID' });
});

export const updateAllScores = asyncHandler(async (req, res) => {
  await updateAllScoresService();
  return makeResponse({ res, status: 200, message: "All User's scores updated" });
});

export const changePassword = asyncHandler(async (req, res) => {
  const result = await changePasswordService(req.user, req.body.old_password, req.body.new_password);
  if (!result) return makeResponse({ res, status: 500, message: 'Failed to change password' });
  if (result.status) return makeResponse({ res, ...result });
  return makeResponse({ res, message: 'Password changed successfully' });
});
