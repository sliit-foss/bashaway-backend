import { Joi } from 'celebrate';

export const updateSettingsSchema = Joi.object({
  submission_deadline: Joi.date().allow(null),
  registration_deadline: Joi.date().allow(null)
});
