import { getLeaderboardData } from '@/repository/user';
import { makeResponse } from '@/utils/response';

export const getLeaderboard = async (_, res) => {
  const data = await getLeaderboardData();
  return makeResponse({
    res,
    data,
    message: 'Leaderboard retrieved successfully'
  });
};
