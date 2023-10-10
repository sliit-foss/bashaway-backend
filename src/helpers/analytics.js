import { getRoundBreakpoint } from '@/repository/settings';

export const getAnalyticTeamFilters = (round, ghostLegion) => {
  if (round == 2 && !ghostLegion) {
    return { eliminated: false };
  }
  return {};
};

export const getAnalyticFilters = async (round, ghostLegion, roundBreakpoint) => {
  const submissionFilters = {};
  roundBreakpoint ??= await getRoundBreakpoint();
  if (roundBreakpoint) {
    if (round == 2) {
      submissionFilters.created_at = { $gte: new Date(roundBreakpoint) };
    } else {
      submissionFilters.created_at = { $lt: new Date(roundBreakpoint) };
    }
  }
  return { teamFilters: getAnalyticTeamFilters(round, ghostLegion), submissionFilters };
};
