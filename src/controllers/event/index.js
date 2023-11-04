import * as eventService from '@/services/event';
import { makeResponse } from '@/utils/response';

export * from './ticket';

export const getAllEvents = async (req, res) => {
  const data = await eventService.retrieveAll(req.user, req.query);
  return makeResponse({ res, data, message: 'Events retrieved successfully' });
};

export const createEvent = async (req, res) => {
  const data = await eventService.create(req.body, req.user);
  return makeResponse({ res, status: 201, data, message: 'Event added successfully' });
};

export const getEventById = async (req, res) => {
  const result = await eventService.retrieve(req.params.event_id, req.user);
  return makeResponse({ res, data: result, message: 'Event retrieved successfully' });
};

export const updateEvent = async (req, res) => {
  const result = await eventService.update(req.params.event_id, req.body, req.user);
  return makeResponse({ res, data: result, message: 'Event updated successfully' });
};

export const deleteEvent = async (req, res) => {
  await eventService.deleteOne(req.params.event_id, req.user);
  return makeResponse({ res, message: 'Event deleted successfully' });
};
