import * as userService from '@/services/user';
import { makeResponse } from '@/utils/response';

export const createUser = async (req, res) => {
  const user = await userService.create(req.body);
  return makeResponse({ res, data: user, message: 'User added successfully' });
};

export const getAllUsers = async (req, res) => {
  const users = await userService.retrieveAll(req.query);
  return makeResponse({ res, data: users, message: 'Users retrieved succesfully' });
};

export const getUserById = async (req, res) => {
  const user = await userService.retrieve(req.params.id);
  return makeResponse({ res, data: user, message: 'User retrieved succesfully' });
};

export const updateUser = async (req, res) => {
  const user = await userService.update(req.params.id, req.user, req.body);
  return makeResponse({ res, data: user, message: 'User updated successfully' });
};

export const changeUserPassword = async (req, res) => {
  await userService.changePassword(req.user, req.body.old_password, req.body.new_password);
  return makeResponse({ res, message: 'Password changed successfully' });
};
