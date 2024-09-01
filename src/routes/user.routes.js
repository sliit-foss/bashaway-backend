import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { changePassword, create, eliminateTeams, getAll, getById, update } from '@/controllers/user';
import { adminProtect, externalPartyProtect } from '@/middleware/auth';
import {
  addUserSchema,
  changePasswordSchema,
  eliminateQuerySchema,
  updateSchema,
  userIdSchema
} from '@/validations/user';

const users = express.Router();

users.post('/', adminProtect, celebrate({ [Segments.BODY]: addUserSchema }), tracedAsyncHandler(create));
users.get('/', externalPartyProtect, adminProtect, tracedAsyncHandler(getAll));
users.get('/:id', celebrate({ [Segments.PARAMS]: userIdSchema }), adminProtect, tracedAsyncHandler(getById));
users.patch(
  '/change_password',
  celebrate({ [Segments.BODY]: changePasswordSchema }),
  tracedAsyncHandler(changePassword)
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
  tracedAsyncHandler(update)
);

export default users;
