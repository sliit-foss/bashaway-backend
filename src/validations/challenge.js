import { Joi } from 'celebrate';

export const addChallengeSchema = {
  name: Joi.string().required(),
  description: Joi.string().required(),
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD', 'EXTREME').required(),
  constraints: Joi.array().items(Joi.string()).optional(),
  max_score: Joi.number().required(),
  enabled: Joi.boolean().optional(),
  creator_lock: Joi.boolean().optional(),
  codebase_url: Joi.string().required(),
  strict_inputs: Joi.boolean().optional()
};

export const updateChallengeSchema = {
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD', 'EXTREME').optional(),
  constraints: Joi.array().items(Joi.string()).optional(),
  max_score: Joi.number().optional(),
  enabled: Joi.boolean().optional(),
  creator_lock: Joi.boolean().optional(),
  codebase_url: Joi.string().optional(),
  strict_inputs: Joi.boolean().optional()
};

export const challengeIdSchema = {
  challenge_id: Joi.string().hex().length(24).required()
};
