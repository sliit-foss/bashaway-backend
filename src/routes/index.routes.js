import express from 'express';
import { ROLE } from '@/constants';
import { protect, roleProtect } from '@/middleware/auth';
import authRouter from './auth.routes';
import dashboardRouter from './dashboard.routes';
import leaderboardRouter from './leaderboard.routes';
import questionRouter from './question.routes';
import settingRouter from './setting.routes';
import storageRouter from './storage.routes';
import submissionRouter from './submission.routes';
import userRouter from './user.routes';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/submissions', protect, submissionRouter);
router.use('/users', protect, userRouter);
router.use('/questions', protect, questionRouter);
router.use('/dashboard', protect, roleProtect([ROLE.ADMIN, ROLE.SPECTATOR]), dashboardRouter);
router.use('/leaderboard', leaderboardRouter);
router.use('/settings', protect, settingRouter);
router.use('/storage', protect, roleProtect([ROLE.ADMIN]), storageRouter);

export default router;
