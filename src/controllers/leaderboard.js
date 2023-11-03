import * as leaderboardService from '@/services/leaderboard';
import { makeResponse } from '@/utils/response';

export const getLeaderboard = async (req, res) => {
  const rankings = await leaderboardService.getLeaderboard(req.query.round, req.query.ghost_legion);
  return makeResponse({
    res,
    data: rankings,
    message: 'Leaderboard retrieved successfully'
  });
};
