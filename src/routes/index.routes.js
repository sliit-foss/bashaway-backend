import express from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import submissionRouter from './submission.routes';
import { protect, adminProtect } from '../middleware/auth';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/submission', protect, submissionRouter);
router.use('/users', protect, adminProtect, userRouter);

export default router;