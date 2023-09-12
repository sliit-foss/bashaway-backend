import { Joi } from 'celebrate';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const refreshTokenSchema = {
  refresh_token: Joi.string().required()
};

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&^()._*?]{8,30}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password should have at least one lowercase letter, one uppercase letter, one number and one special character and should be at least 8 characters long'
    }),
  university: Joi.string().required(),
  members: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().min(9).required(),
        academic_year: Joi.number().required().min(1).max(4)
      })
    )
    .max(4)
    .required()
    .unique((a, b) => a.email === b.email)
    .unique((a, b) => a.phone === b.phone)
    .messages({ 'array.unique': 'Member details should be unique' })
    .min(1)
});

export const resendVerifyMailSchema = Joi.object({
  email: Joi.string().email().required()
});

export const forgotPasswordSchema = {
  email: Joi.string().email().required()
};

export const resetPasswordSchema = {
  new_password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&^()._*?]{8,30}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password should have at least one lowercase letter, one uppercase letter, one number and one special character and should be at least 8 characters long'
    })
};

export const validUserResetPasswordSchema = {
  verification_code: Joi.string().required()
};

export const verifySchema = Joi.object({
  verification_code: Joi.string().required()
});
