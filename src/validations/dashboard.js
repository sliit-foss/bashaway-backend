import { Joi } from 'celebrate';

export const eventIdSchema = {
  event_id: Joi.string().hex().length(24)
};
