import { Joi } from 'celebrate';

export const updateSettingsSchema = Joi.object.keys({
  submissionDeadline: Joi.date().allow(null),
  registrationDeadline: Joi.date().allow(null)
});
