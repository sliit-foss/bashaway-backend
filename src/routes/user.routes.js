import express from 'express';
import { create, getAll, getById, remove, update, updateScore, updateScoreAll, updateAllScores } from '../controllers/user';

const userRouter = express.Router();

userRouter.post('/', create);
userRouter.get('/', getAll);
userRouter.put('/', updateAllScores);
userRouter.get('/:id', getById);
userRouter.put('/:id', update);
userRouter.put('/:id/score', updateScore);
userRouter.delete('/:id', remove);

export default userRouter;
