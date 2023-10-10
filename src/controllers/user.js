import {
  addNewUser,
  changePasswordService,
  eliminateTeams as eliminate,
  getUserByID,
  getUsers,
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

export const changePassword = async (req, res) => {
  await changePasswordService(req.user, req.body.old_password, req.body.new_password);
  return makeResponse({ res, message: 'Password changed successfully' });
};

export const eliminateTeams = async (req, res) => {
  await eliminate(req.query.vanguard);
  return makeResponse({ res, message: `Eliminated all teams except the top ${req.query.vanguard}` });
};
