import express from 'express';
import { create, getAll, getById, remove, update, updateScore } from '../controllers/user';

const userRouter = express.Router();

userRouter.post('/create', create);
userRouter.get('/getAll', getAll);
userRouter.get('/getById/:id', getById);
userRouter.put('/update/:id', update);
userRouter.delete('/remove/:id', remove);
userRouter.put('/updateScore', updateScore);

export default userRouter;
