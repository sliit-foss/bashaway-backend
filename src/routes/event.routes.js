import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import {
  approveUserTicket,
  cancelTicketPayment,
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getEventBySlug,
  getUserEventTicket,
  initiateTicketPayment,
  requestEventTicket,
  transferTicket,
  updateEvent,
  verifyTicketPayment
} from '@/controllers/event';
import { adminProtect, identify, protect } from '@/middleware/auth';
import {
  addEventSchema,
  eventIdSchema,
  eventSlugSchema,
  eventTicketIdSchema,
  initiateTicketPaymentSchema,
  requestTicketSchema,
  transferTicketSchema,
  updateEventSchema
} from '@/validations/event';

const events = express.Router();

events.get('/', identify, tracedAsyncHandler(getAllEvents));
events.post(
  '/',
  celebrate({ [Segments.BODY]: addEventSchema }),
  protect,
  adminProtect,
  tracedAsyncHandler(createEvent)
);
events.get('/:event_id', identify, celebrate({ [Segments.PARAMS]: eventIdSchema }), tracedAsyncHandler(getEventById));
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
events.get(
  '/slugs/:slug',
  identify,
  celebrate({ [Segments.PARAMS]: eventSlugSchema }),
  tracedAsyncHandler(getEventBySlug)
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
events.post(
  '/:event_id/tickets/:ticket_id/payment',
  protect,
  celebrate({ [Segments.PARAMS]: eventTicketIdSchema, [Segments.BODY]: initiateTicketPaymentSchema }),
  tracedAsyncHandler(initiateTicketPayment)
);
events.get(
  '/:event_id/tickets/:ticket_id/payment/verify',
  protect,
  celebrate({ [Segments.PARAMS]: eventTicketIdSchema }),
  tracedAsyncHandler(verifyTicketPayment)
);
events.patch(
  '/:event_id/tickets/:ticket_id/payment/cancel',
  protect,
  celebrate({ [Segments.PARAMS]: eventTicketIdSchema }),
  tracedAsyncHandler(cancelTicketPayment)
);
events.patch(
  '/:event_id/tickets/:ticket_id/transfer',
  protect,
  celebrate({ [Segments.PARAMS]: eventTicketIdSchema, [Segments.BODY]: transferTicketSchema }),
  tracedAsyncHandler(transferTicket)
);

export default events;
