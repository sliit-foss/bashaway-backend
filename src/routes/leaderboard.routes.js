import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { getLeaderboardInfo } from '@/controllers/submission';

const leaderboardRouter = express.Router();

leaderboardRouter.get('/', tracedAsyncHandler(getLeaderboardInfo));

export default leaderboardRouter;
