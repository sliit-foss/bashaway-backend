import * as dashboardService from '@/services/dashboard';
import { makeResponse } from '@/utils/response';

export const getRegistrationInfo = async (_, res) => {
  const data = await dashboardService.getRegistrations();
  return makeResponse({
    res,
    data,
    message: 'Registration info retrieved successfully'
  });
};

export const getTicketInfo = async (req, res) => {
  const data = await dashboardService.getTicketInfo(req.query.event_id);
  return makeResponse({
    res,
    data,
    message: 'Ticket info retrieved successfully'
  });
};
