import { Joi } from 'celebrate';

const optionals = {
  photo_url: Joi.string().optional(),
  organization: Joi.string().optional(),
  designation: Joi.string().optional()
};

export const addSpeakerSchema = {
  ...optionals,
  name: Joi.string().required(),
  email: Joi.string().email().required()
};

export const updateSpeakerSchema = {
  ...optionals,
  name: Joi.string().optional(),
  email: Joi.string().email().optional()
};

export const speakerIdSchema = {
  speaker_id: Joi.string().hex().length(24).required()
};
