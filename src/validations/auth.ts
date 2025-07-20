import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().pattern(/^\S+$/).min(3).required().messages({
    "string.pattern.base": "username is not allowed to contain spaces",
    "string.empty": "username is required",
    "string.min": "username must be at least 3 characters long",
  }),
  name: Joi.string().min(3).required().messages({
    "string.empty": "name is required",
    "string.min": "name must be at least 3 characters long",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "email is required",
    "string.email": "email is not valid",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "password is required",
    "string.min": "password must be at least 6 characters long",
  }),
});

export const loginSchema = Joi.object({
  identifier: Joi.string().required().messages({
    "string.empty": "username or email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "password is required",
  }),
});

// export const updateUserSchema = Joi.object({
//   name: Joi.string().min(3),
//   picture: Joi.string(),
// });
