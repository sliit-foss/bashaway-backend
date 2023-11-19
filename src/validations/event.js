import { Joi } from 'celebrate';

const optionals = {
  slug: Joi.string().optional(),
  photo_urls: Joi.object({
    'default': Joi.string().optional(),
    'sm': Joi.string().optional(),
    'md': Joi.string().optional(),
    'lg': Joi.string().optional(),
    'xl': Joi.string().optional(),
    '2xl': Joi.string().optional()
  }).optional(),
  tags: Joi.array().items(Joi.string()).min(2).max(2),
  guidelines: Joi.string().optional(),
  faqs: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required()
      })
    )
    .optional(),
  speakers: Joi.array().items(Joi.string().hex().length(24)).optional(),
  survey: Joi.array().items(Joi.string()).optional(),
  coverage: Joi.array().items(Joi.string()).optional(),
  creator_lock: Joi.boolean().optional(),
  settings: Joi.object({
    enabled: Joi.boolean().optional(),
    automatic_approval: Joi.boolean().optional(),
    registration_start: Joi.date().required(),
    registration_end: Joi.date().required(),
    payments: Joi.object({
      enabled: Joi.boolean().optional(),
      ticket_cost: Joi.number().optional(),
      allow_coupons: Joi.boolean().optional(),
      speaker_discount: Joi.number().optional(),
      early_bird_discount: Joi.object({
        enabled: Joi.boolean().optional(),
        deadline: Joi.date().optional(),
        percentage: Joi.number().optional()
      }).optional()
    }).optional(),
    visuals: Joi.object({
      color_code: Joi.string().optional()
    }).optional()
  })
};

export const addEventSchema = {
  ...optionals,
  name: Joi.string().required(),
  description: Joi.string().required(),
  capacity: Joi.number().required(),
  event_date: Joi.date().required().greater('now'),
  tags: optionals.tags.required(),
  settings: optionals.settings.required()
};

export const updateEventSchema = {
  ...optionals,
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  capacity: Joi.number().optional(),
  event_date: Joi.date().optional(),
  settings: optionals.settings
    .concat(
      Joi.object({
        registration_start: Joi.date().optional(),
        registration_end: Joi.date().optional()
      })
    )
    .optional()
};

export const eventIdSchema = {
  event_id: Joi.string().hex().length(24).required()
};

export const eventTicketIdSchema = {
  ...eventIdSchema,
  ticket_id: Joi.string().hex().length(24).required()
};

export const requestTicketSchema = {
  survey_answers: Joi.array().items(Joi.string()).default([])
};
