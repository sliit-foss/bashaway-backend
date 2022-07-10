import {Joi} from "celebrate";

export const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    photo_url: Joi.string().optional(),
});

