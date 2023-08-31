import { Joi } from 'celebrate';

export const signUrlSchema = {
  url: Joi.string().required(),
  upload: Joi.boolean().default(false)
};
