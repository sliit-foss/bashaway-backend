import { retrieve } from '.';

export const requestTicket = async (event_id, data, user) => {
  const event = await retrieve(event_id, user);
  if (event.settings.automatic_approval) {
  }
};
