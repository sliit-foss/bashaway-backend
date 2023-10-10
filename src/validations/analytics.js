import { Joi } from 'celebrate';

export const analyticsQuerySchema = {
  round: Joi.number().optional().valid(1, 2).default(1),
  ghost_legion: Joi.boolean().optional().default(false)
};
