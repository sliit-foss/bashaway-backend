import { Joi } from "celebrate"

export const submissionIdSchema= {
  id: Joi.string().hex().length(24).required()
}
