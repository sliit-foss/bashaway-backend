import express from 'express';
import { adminProtect, protect } from '@/middleware/auth';
import authRouter from './auth.routes';
import challengeRouter from './challenge.routes';
import dashboardRouter from './dashboard.routes';
import leaderboardRouter from './leaderboard.routes';
import settingRouter from './setting.routes';
import storageRouter from './storage.routes';
import submissionRouter from './submission.routes';
import userRouter from './user.routes';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/submissions', protect, submissionRouter);
router.use('/users', protect, userRouter);
router.use('/challenges', protect, challengeRouter);
router.use('/dashboard', protect, adminProtect, dashboardRouter);
router.use('/leaderboard', leaderboardRouter);
router.use('/settings', protect, settingRouter);
router.use('/storage', protect, adminProtect, storageRouter);

export default router;
