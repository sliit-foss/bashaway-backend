import { tracedAsyncHandler } from '@sliit-foss/functions';
import express from 'express';
import { Segments, celebrate } from 'celebrate';
import { addUserSchema, changePasswordSchema, updateSchema, userIdSchema } from '@/validations/user';
import { changePassword, create, getAll, getById, update, updateAllScores, updateScore } from '@/controllers/user';
import { adminProtect } from '@/middleware/auth';

const userRouter = express.Router();

userRouter.post('/', adminProtect, celebrate({ [Segments.BODY]: addUserSchema }), tracedAsyncHandler(create));
userRouter.get('/', adminProtect, tracedAsyncHandler(getAll));
userRouter.get('/:id', celebrate({ [Segments.PARAMS]: userIdSchema }), adminProtect, tracedAsyncHandler(getById));
userRouter.put('/score', adminProtect, tracedAsyncHandler(updateAllScores));
userRouter.put(
  '/change_password',
  celebrate({ [Segments.BODY]: changePasswordSchema }),
  tracedAsyncHandler(changePassword)
);
userRouter.put(
  '/:id',
  celebrate({ [Segments.PARAMS]: userIdSchema, [Segments.BODY]: updateSchema }),
  tracedAsyncHandler(update)
);
userRouter.put(
  '/:id/score',
  adminProtect,
  celebrate({ [Segments.PARAMS]: userIdSchema }),
  tracedAsyncHandler(updateScore)
);

export default userRouter;
