import * as leaderboardService from '@/services/leaderboard';
import { makeResponse } from '@/utils/response';

export const getLeaderboard = async (_, res) => {
  const rankings = await leaderboardService.getLeaderboard();
  return makeResponse({
    res,
    data: rankings,
    message: 'Leaderboard retrieved successfully'
  });
};
