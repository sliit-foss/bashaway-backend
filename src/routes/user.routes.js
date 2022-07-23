import express from 'express';
import { create, getAll, getById, remove, update, updateScore, updateAllScores, changePassword } from '../controllers/user';
import { adminProtect } from '../middleware/auth';
import { celebrate, Segments } from "celebrate"
import { changePasswordSchema } from '../validations/user';

const userRouter = express.Router();

userRouter.post('/', adminProtect, create);
userRouter.get('/', adminProtect, getAll);
userRouter.get('/:id', adminProtect, getById);
userRouter.put('/score', updateAllScores);
userRouter.put('/change_password', celebrate({ [Segments.BODY]: changePasswordSchema }), changePassword);
userRouter.put('/:id', adminProtect, update);
userRouter.put('/:id/score', adminProtect, updateScore);

export default userRouter;
