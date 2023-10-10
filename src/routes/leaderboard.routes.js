import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { getLeaderboard } from '@/controllers/leaderboard';
import { analyticsQuerySchema } from '@/validations/analytics';

const leaderboard = express.Router();

leaderboard.get('/', celebrate({ [Segments.QUERY]: analyticsQuerySchema }), tracedAsyncHandler(getLeaderboard));

export default leaderboard;
