import { getAllQuestionsSubmissions, getAllTeamSubmissions, getRegistrations } from '@/services/dashboard';
import { makeResponse } from '@/utils/response';

export const getQuestionSubmissions = async (req, res) => {
  const data = await getAllQuestionsSubmissions(req.user, req.query.round, req.query.ghost_legion);
  return makeResponse({
    res,
    data,
    message: 'Question submissions retrieved successfully'
  });
};

export const getTeamSubmissions = async (req, res) => {
  const data = await getAllTeamSubmissions(req.query.round, req.query.ghost_legion);
  return makeResponse({
    res,
    data,
    message: 'Team submissions retrieved successfully'
  });
};

export const getRegistrationInfo = async (req, res) => {
  const data = await getRegistrations(req.query.round, req.query.ghost_legion);
  return makeResponse({
    res,
    data,
    message: 'Registration info retrieved successfully'
  });
};
