import Joi from "joi";

export const getFollowsSchema = Joi.object({
  type: Joi.string().valid("following", "followers").required(),
});
