import express from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import submissionRouter from './submission.routes';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/submission', submissionRouter);

export default router;