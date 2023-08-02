import { Joi } from 'celebrate';

export const submissionIdSchema = {
  id: Joi.string().hex().length(24).required()
};

export const submissionUpdateSchema = {
  score: Joi.number().required(),
  is_automatically_graded: Joi.boolean().required(),
}

export const submissionCreateSchema = {
  question: Joi.string().hex().length(24).required(),
  link: Joi.string().required()
};

export const submissionViewSchema = {
  filter: Joi.object()
    .keys({
      question: Joi.string().hex().length(24).optional(),
      user: Joi.string().hex().length(24).optional(),
      graded_by: Joi.string().hex().length(24).optional()
    })
    .optional(),
  sort: Joi.object()
    .keys({
      score: Joi.any().valid('asc', 'desc', '1', '-1', 1, -1).optional(),
      created_at: Joi.any().valid('asc', 'desc', '1', '-1', 1, -1).optional(),
      updated_at: Joi.any().valid('asc', 'desc', '1', '-1', 1, -1).optional()
    })
    .optional(),
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
};
