import { getRoundBreakpoint } from '@/repository/settings';

export const getAnalyticTeamFilters = (round, ghostLegion, excludeTeams) => {
  const excludedTeams = ['Byte Bashers']; // From a sponsoring company
  const teamFilters = {};
  if (round == 2 && !ghostLegion) {
    teamFilters.eliminated = false;
  }
  if (excludeTeams & (excludeTeams.length !== 0)) {
    teamFilters.name = {
      $nin: excludedTeams
    };
  }
  return teamFilters;
};

export const getAnalyticFilters = async (round, ghostLegion, roundBreakpoint, excludeTeams) => {
  const submissionFilters = {};
  roundBreakpoint ??= await getRoundBreakpoint();
  if (roundBreakpoint) {
    if (round == 2) {
      submissionFilters.created_at = { $gte: new Date(roundBreakpoint) };
    } else {
      submissionFilters.created_at = { $lt: new Date(roundBreakpoint) };
    }
  }
  return { teamFilters: getAnalyticTeamFilters(round, ghostLegion, excludeTeams), submissionFilters };
};
