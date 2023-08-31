import { getQuestionSubmissions } from '@/repository/question';
import { getTeamSubmissions } from '@/repository/submission';
import { getAllUniverstyUserGroups } from '@/repository/user';

export const getAllQuestionsSubmissions = (user) => {
  return getQuestionSubmissions(user);
};

export const getAllTeamSubmissions = () => {
  return getTeamSubmissions();
};

export const getRegistrations = async () => {
  const userGroups = await getAllUniverstyUserGroups();
  return {
    university_counts: userGroups,
    total_registrations: userGroups.reduce((acc, curr) => acc + curr.count, 0),
    total_members: userGroups.reduce((acc, curr) => acc + curr.member_count, 0)
  };
};
