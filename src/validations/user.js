import {Joi} from "celebrate";

export const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    university: Joi.string().optional(),
    members: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.number().required(),
        academic_year: Joi.number().required()
    })).max(4).optional(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const verifySchema = Joi.object({
    verification_code: Joi.string().required(),
})
