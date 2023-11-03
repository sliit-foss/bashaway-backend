import * as dashboardService from '@/services/dashboard';
import { makeResponse } from '@/utils/response';

export const getChallengeSubmissions = async (req, res) => {
  const data = await dashboardService.getAllChallengeSubmissions(req.user, req.query.round, req.query.ghost_legion);
  return makeResponse({
    res,
    data,
    message: 'Challenge submissions retrieved successfully'
  });
};

export const getTeamSubmissions = async (req, res) => {
  const data = await dashboardService.getAllTeamSubmissions(req.query.round, req.query.ghost_legion);
  return makeResponse({
    res,
    data,
    message: 'Team submissions retrieved successfully'
  });
};

export const getRegistrationInfo = async (req, res) => {
  const data = await dashboardService.getRegistrations(req.query.round, req.query.ghost_legion);
  return makeResponse({
    res,
    data,
    message: 'Registration info retrieved successfully'
  });
};
