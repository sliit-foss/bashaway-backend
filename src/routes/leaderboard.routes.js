import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { getLeaderboard } from '@/controllers/user';

const leaderboardRouter = express.Router();

leaderboardRouter.get('/', tracedAsyncHandler(getLeaderboard));

export default leaderboardRouter;
