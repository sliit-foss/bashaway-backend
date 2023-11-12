import createError from 'http-errors';
import * as eventRepository from '@/repository/event';

export * from './ticket';

export const retrieveAll = (user, query) => eventRepository.findAll(user, query);

export const create = (data, user) => eventRepository.insertOne({ ...data, creator: user?._id });

export const retrieve = async (event_id, user) => {
  const result = await eventRepository.findById(event_id, user);
  if (!result) throw new createError(404, "Event doesn't exist or you do not have permission to access this event");
  return result;
};

export const update = async (event_id, data, user) => {
  const event = await retrieve(event_id, user);
  if (data.name) {
    const check = await eventRepository.findOne({ name: data.name, _id: { $ne: event_id } });
    if (check) throw new createError(400, 'Event name is already taken');
  }
  if (event.creator_lock && event.creator !== user._id)
    throw new createError(403, 'You are not authorized to update this event');
  return eventRepository.updateById(event_id, data);
};

export const deleteOne = async (event_id, user) => {
  const event = await retrieve(event_id, user);
  if (event.settings.enabled) {
    throw new createError(400, 'Failed to delete event as it is active');
  }
  if (event.creator_lock && event.creator !== user._id)
    throw new createError(403, 'You are not authorized to delete this event');
  return eventRepository.deleteById(event_id);
};
