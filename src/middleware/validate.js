import Joi from "joi";

/**
 * Joi wrapper – use as validate(schema)
 */
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details.map((d) => d.message).join(", "),
    });
  }
  next();
};
