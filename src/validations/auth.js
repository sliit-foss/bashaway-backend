import { Joi } from 'celebrate';
import { domains, genders, mealPreferences, tshirtSizes } from '@/models/user';

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
  domain: Joi.string()
    .valid(...domains)
    .required(),
  phone: Joi.string().min(9).required(),
  nic: Joi.string().required(),
  gender: Joi.string()
    .valid(...genders)
    .required(),
  meal_preference: Joi.string()
    .valid(...mealPreferences)
    .required(),
  tshirt_size: Joi.string()
    .valid(...tshirtSizes)
    .required()
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

export const verifySchema = Joi.object({
  verification_code: Joi.string().required()
});
