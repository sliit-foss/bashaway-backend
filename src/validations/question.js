import { Joi } from "celebrate";

export const addQuestionSchema = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD').required(),
    bash_only: Joi.boolean().required(),
    max_score: Joi.number().required(),
    enabled: Joi.boolean().optional(),
}

export const questionIdSchema = {
    question_id: Joi.string().hex()
        .length(24).required()
}