import { getSubmissions as getChallengeSubmissions } from '@/repository/challenge';
import { getTeamSubmissions } from '@/repository/submission';
import { getAllUserGroups } from '@/repository/user';

export const getAllChallengeSubmissions = (user) => getChallengeSubmissions(user);

export const getAllTeamSubmissions = () => getTeamSubmissions();

export const getRegistrations = async () => {
  const userGroups = await getAllUserGroups();
  return {
    domain_counts: userGroups,
    total_registrations: userGroups.reduce((acc, curr) => acc + curr.count, 0)
  };
};
