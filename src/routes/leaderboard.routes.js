import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { getLeaderboard } from '@/controllers/leaderboard';

const leaderboard = express.Router();

leaderboard.get('/', tracedAsyncHandler(getLeaderboard));

export default leaderboard;
