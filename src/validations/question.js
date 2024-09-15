import { Joi } from 'celebrate';
import { DIFFICULTY } from '@/constants';

export const addQuestionSchema = {
  name: Joi.string().required(),
  description: Joi.string().required(),
  difficulty: Joi.string()
    .valid(...Object.values(DIFFICULTY))
    .required(),
  constraints: Joi.array().items(Joi.string()).optional(),
  max_score: Joi.number().required(),
  enabled: Joi.boolean().optional(),
  creator_lock: Joi.boolean().optional(),
  codebase_url: Joi.string().required(),
  strict_inputs: Joi.boolean().optional()
};

export const updateQuestionSchema = {
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  difficulty: Joi.string()
    .valid(...Object.values(DIFFICULTY))
    .optional(),
  constraints: Joi.array().items(Joi.string()).optional(),
  max_score: Joi.number().optional(),
  enabled: Joi.boolean().optional(),
  creator_lock: Joi.boolean().optional(),
  codebase_url: Joi.string().optional(),
  strict_inputs: Joi.boolean().optional()
};

export const questionIdSchema = {
  question_id: Joi.string().hex().length(24).required()
};
