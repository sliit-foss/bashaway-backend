import express from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import submissionRouter from './submission.routes';
import questionRouter from './question.routes';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/submissions', protect, submissionRouter);
router.use('/users', protect, userRouter);
router.use('/questions', protect, questionRouter);

export default router;
