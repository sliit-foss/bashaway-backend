import { getAnalyticFilters, getAnalyticTeamFilters } from '@/helpers';
import { getQuestionSubmissions } from '@/repository/question';
import { getTeamSubmissions } from '@/repository/submission';
import { getAllUniverstyUserGroups } from '@/repository/user';

export const getAllQuestionsSubmissions = async (user, round, ghostLegion) => {
  const { teamFilters, submissionFilters } = await getAnalyticFilters(round, ghostLegion);
  return getQuestionSubmissions(user, teamFilters, submissionFilters);
};

export const getAllTeamSubmissions = async (round, ghostLegion) => {
  const { teamFilters, submissionFilters } = await getAnalyticFilters(round, ghostLegion);
  return getTeamSubmissions(submissionFilters, teamFilters);
};

export const getRegistrations = async (round, ghostLegion) => {
  const userGroups = await getAllUniverstyUserGroups(getAnalyticTeamFilters(round, ghostLegion));
  return {
    university_counts: userGroups,
    total_registrations: userGroups.reduce((acc, curr) => acc + curr.count, 0),
    total_members: userGroups.reduce((acc, curr) => acc + curr.member_count, 0)
  };
};
