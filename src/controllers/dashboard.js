import * as dashboardService from '@/services/dashboard';
import { makeResponse } from '@/utils/response';

export const getChallengeSubmissions = async (req, res) => {
  const data = await dashboardService.getAllChallengeSubmissions(req.user);
  return makeResponse({
    res,
    data,
    message: 'Challenge submissions retrieved successfully'
  });
};

export const getTeamSubmissions = async (_, res) => {
  const data = await dashboardService.getAllTeamSubmissions();
  return makeResponse({
    res,
    data,
    message: 'Team submissions retrieved successfully'
  });
};

export const getRegistrationInfo = async (_, res) => {
  const data = await dashboardService.getRegistrations();
  return makeResponse({
    res,
    data,
    message: 'Registration info retrieved successfully'
  });
};
