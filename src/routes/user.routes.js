import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import {
  changeUserPassword,
  createUser,
  eliminateTeams,
  getAllUsers,
  getUserById,
  updateUser
} from '@/controllers/user';
import { adminProtect } from '@/middleware/auth';
import {
  addUserSchema,
  changePasswordSchema,
  eliminateQuerySchema,
  updateSchema,
  userIdSchema
} from '@/validations/user';

const users = express.Router();

users.post('/', adminProtect, celebrate({ [Segments.BODY]: addUserSchema }), tracedAsyncHandler(createUser));
users.get('/', adminProtect, tracedAsyncHandler(getAllUsers));
users.get('/:id', celebrate({ [Segments.PARAMS]: userIdSchema }), adminProtect, tracedAsyncHandler(getUserById));
users.patch(
  '/change_password',
  celebrate({ [Segments.BODY]: changePasswordSchema }),
  tracedAsyncHandler(changeUserPassword)
);
users.patch(
  '/eliminate',
  adminProtect,
  celebrate({ [Segments.QUERY]: eliminateQuerySchema }),
  tracedAsyncHandler(eliminateTeams)
);
users.patch(
  '/:id',
  celebrate({ [Segments.PARAMS]: userIdSchema, [Segments.BODY]: updateSchema }),
  tracedAsyncHandler(updateUser)
);

export default users;
