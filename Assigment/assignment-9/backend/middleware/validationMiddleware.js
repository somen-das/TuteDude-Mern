const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const schemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  visitorRegistration: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    company: Joi.string().allow('', null),
    hostId: Joi.string().required(),
    date: Joi.date().iso().required(),
    purpose: Joi.string().required()
  }),
  updateStatus: Joi.object({
    status: Joi.string().valid('Approved', 'Rejected').required()
  }),
  scanPass: Joi.object({
    passId: Joi.string().required()
  })
};

module.exports = { validate, schemas };
