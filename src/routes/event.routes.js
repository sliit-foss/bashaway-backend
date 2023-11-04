import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from '@/controllers/event';
import { adminProtect } from '@/middleware/auth';
import { addEventSchema, eventIdSchema, updateEventSchema } from '@/validations/event';

const events = express.Router();

events.get('/', tracedAsyncHandler(getAllEvents));
events.post('/', celebrate({ [Segments.BODY]: addEventSchema }), adminProtect, tracedAsyncHandler(createEvent));
events.get('/:event_id', celebrate({ [Segments.PARAMS]: eventIdSchema }), tracedAsyncHandler(getEventById));
events.patch(
  '/:event_id',
  celebrate({ [Segments.PARAMS]: eventIdSchema, [Segments.BODY]: updateEventSchema }),
  adminProtect,
  tracedAsyncHandler(updateEvent)
);
events.delete(
  '/:event_id',
  celebrate({ [Segments.PARAMS]: eventIdSchema }),
  adminProtect,
  tracedAsyncHandler(deleteEvent)
);

export default events;
