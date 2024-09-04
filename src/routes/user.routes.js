import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { changePassword, create, eliminateTeams, getAll, getById, update } from '@/controllers/user';
import { roleProtect } from '@/middleware/auth';
import {
  addUserSchema,
  changePasswordSchema,
  eliminateQuerySchema,
  updateSchema,
  userIdSchema
} from '@/validations/user';

const users = express.Router();

users.post('/', roleProtect(['ADMIN']), celebrate({ [Segments.BODY]: addUserSchema }), tracedAsyncHandler(create));
users.get('/', roleProtect(['ADMIN', 'SPECTATOR']), tracedAsyncHandler(getAll));
users.get('/:id', celebrate({ [Segments.PARAMS]: userIdSchema }), roleProtect(['ADMIN']), tracedAsyncHandler(getById));
users.patch(
  '/change_password',
  celebrate({ [Segments.BODY]: changePasswordSchema }),
  tracedAsyncHandler(changePassword)
);
users.patch(
  '/eliminate',
  roleProtect(['ADMIN']),
  celebrate({ [Segments.QUERY]: eliminateQuerySchema }),
  tracedAsyncHandler(eliminateTeams)
);
users.patch(
  '/:id',
  celebrate({ [Segments.PARAMS]: userIdSchema, [Segments.BODY]: updateSchema }),
  tracedAsyncHandler(update)
);

export default users;
