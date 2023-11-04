import express from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, celebrate } from 'celebrate';
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from '@/controllers/event';
import { adminProtect } from '@/middleware/auth';
import { addChallengeSchema, challengeIdSchema, updateChallengeSchema } from '@/validations/challenge';

const events = express.Router();

events.get('/', tracedAsyncHandler(getAllEvents));
events.post('/', celebrate({ [Segments.BODY]: addChallengeSchema }), adminProtect, tracedAsyncHandler(createEvent));
events.get('/:event_id', celebrate({ [Segments.PARAMS]: challengeIdSchema }), tracedAsyncHandler(getEventById));
events.patch(
  '/:event_id',
  celebrate({ [Segments.PARAMS]: challengeIdSchema, [Segments.BODY]: updateChallengeSchema }),
  adminProtect,
  tracedAsyncHandler(updateEvent)
);
events.delete(
  '/:event_id',
  celebrate({ [Segments.PARAMS]: challengeIdSchema }),
  adminProtect,
  tracedAsyncHandler(deleteEvent)
);

export default events;
