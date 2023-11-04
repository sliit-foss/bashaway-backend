import * as eventService from '@/services/event';
import { makeResponse } from '@/utils/response';

export const requestEventTicket = async (req, res) => {
  await eventService.requestTicket(req.params.event_id, req.body, req.user);
  return makeResponse({ res, message: 'Event ticket requested successfully' });
};
