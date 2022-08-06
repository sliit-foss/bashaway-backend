import { Joi } from 'celebrate'

export const submissionIdSchema = {
  id: Joi.string().hex().length(24).required(),
}

export const submissionCreateSchema = {
  question: Joi.string().hex().length(24).required(),
  link: Joi.string().required(),
}

export const submissionViewSchema = {
  filter: Joi.object()
    .keys({
      question: Joi.string().hex().length(24).optional(),
      user: Joi.string().hex().length(24).optional(),
      graded_by :  Joi.string().hex().length(24).optional(),
    })
    .optional(),
  sort: Joi.object()
    .keys({
      _id: Joi.any().valid('asc', 'desc', '1', '-1').optional(),
      user: Joi.any().valid('asc', 'desc', '1', '-1').optional(),
      question: Joi.any().valid('asc', 'desc', '1', '-1').optional(),
      link: Joi.any().valid('asc', 'desc', '1', '-1').optional(),
      score: Joi.any().valid('asc', 'desc', '1', '-1').optional(),
      graded_by: Joi.any().valid('asc', 'desc', '1', '-1').optional(),
      created_at: Joi.any().valid('asc', 'desc', '1', '-1').optional(),
      updated_at: Joi.any().valid('asc', 'desc', '1', '-1').optional(),
    })
    .optional(),
  pageNum: Joi.number().optional(),
  pageSize: Joi.number().optional(),
}
