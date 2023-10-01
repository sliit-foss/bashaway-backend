import { getLeaderboardRankings } from '@/services/leaderboard';
import { makeResponse } from '@/utils/response';

export const getLeaderboard = async (_, res) => {
  const rankings = await getLeaderboardRankings();
  return makeResponse({
    res,
    data: rankings,
    message: 'Leaderboard retrieved successfully'
  });
};
