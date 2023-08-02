import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { getLeaderboard } from '@/controllers/leaderboard';

const leaderboardRouter = express.Router();

leaderboardRouter.get('/', tracedAsyncHandler(getLeaderboard));

export default leaderboardRouter;
