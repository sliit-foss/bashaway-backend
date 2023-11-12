import * as eventService from '@/services/event';
import { makeResponse } from '@/utils/response';

export const requestEventTicket = async (req, res) => {
  const ticket = await eventService.requestTicket(req.params.event_id, req.body, req.user);
  return makeResponse({ res, data: ticket, message: 'Event ticket requested successfully' });
};

export const getUserEventTicket = async (req, res) => {
  const ticket = await eventService.getUserTicket(req.user);
  return makeResponse({ res, data: ticket, message: 'User ticket retrieved successfully' });
};
