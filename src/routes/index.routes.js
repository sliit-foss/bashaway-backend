import express from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import groupRouter from './group.routes';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/groups', groupRouter);

export default router;