import { Joi } from "celebrate";

export const createGroupSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
});

