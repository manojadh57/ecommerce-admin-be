import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().allow("").max(2000),
  price: Joi.number().positive().precision(2).required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().hex().length(24).required(), // Mongo ObjectId
  images: Joi.array().items(Joi.string().uri()).max(5).default([]),
});
