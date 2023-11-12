import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import {
  approveUserTicket,
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getUserEventTicket,
  requestEventTicket,
  updateEvent
} from '@/controllers/event';
import { adminProtect, protect } from '@/middleware/auth';
import {
  addEventSchema,
  eventIdSchema,
  eventTicketIdSchema,
  requestTicketSchema,
  updateEventSchema
} from '@/validations/event';

const events = express.Router();

events.get('/', tracedAsyncHandler(getAllEvents));
events.post(
  '/',
  celebrate({ [Segments.BODY]: addEventSchema }),
  protect,
  adminProtect,
  tracedAsyncHandler(createEvent)
);
events.get('/:event_id', celebrate({ [Segments.PARAMS]: eventIdSchema }), tracedAsyncHandler(getEventById));
events.patch(
  '/:event_id',
  celebrate({ [Segments.PARAMS]: eventIdSchema, [Segments.BODY]: updateEventSchema }),
  protect,
  adminProtect,
  tracedAsyncHandler(updateEvent)
);
events.delete(
  '/:event_id',
  celebrate({ [Segments.PARAMS]: eventIdSchema }),
  protect,
  adminProtect,
  tracedAsyncHandler(deleteEvent)
);
events.post(
  '/:event_id/tickets/request',
  protect,
  celebrate({ [Segments.PARAMS]: eventIdSchema, [Segments.BODY]: requestTicketSchema }),
  tracedAsyncHandler(requestEventTicket)
);
events.get(
  '/:event_id/tickets/current',
  protect,
  celebrate({ [Segments.PARAMS]: eventIdSchema }),
  tracedAsyncHandler(getUserEventTicket)
);
events.patch(
  '/:event_id/tickets/:ticket_id/approve',
  protect,
  adminProtect,
  celebrate({ [Segments.PARAMS]: eventTicketIdSchema }),
  tracedAsyncHandler(approveUserTicket)
);

export default events;
