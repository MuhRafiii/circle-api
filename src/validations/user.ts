import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(100).messages({
    "string.empty": "name is required",
    "string.min": "name must be at least 3 characters long",
    "string.max": "name must be at most 100 characters long",
  }),
  bio: Joi.string().allow(""),
  username: Joi.string().min(3).max(30).messages({
    "string.empty": "username is required",
    "string.min": "username must be at least 3 characters long",
    "string.max": "username must be at most 30 characters long",
  }),
});
