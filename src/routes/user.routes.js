import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { changePassword, create, getAll, getById, update } from '@/controllers/user';
import { adminProtect } from '@/middleware/auth';
import { addUserSchema, changePasswordSchema, updateSchema, userIdSchema } from '@/validations/user';

const userRouter = express.Router();

userRouter.post('/', adminProtect, celebrate({ [Segments.BODY]: addUserSchema }), tracedAsyncHandler(create));
userRouter.get('/', adminProtect, tracedAsyncHandler(getAll));
userRouter.get('/:id', celebrate({ [Segments.PARAMS]: userIdSchema }), adminProtect, tracedAsyncHandler(getById));
userRouter.patch(
  '/change_password',
  celebrate({ [Segments.BODY]: changePasswordSchema }),
  tracedAsyncHandler(changePassword)
);
userRouter.patch(
  '/:id',
  celebrate({ [Segments.PARAMS]: userIdSchema, [Segments.BODY]: updateSchema }),
  tracedAsyncHandler(update)
);

export default userRouter;
