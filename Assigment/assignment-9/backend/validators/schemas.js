const Joi = require('joi');

const registerVisitorSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  company: Joi.string().allow('', null),
  hostId: Joi.string().required(),
  date: Joi.date().iso().required(),
  purpose: Joi.string().required()
});

const updateAppointmentSchema = Joi.object({
  status: Joi.string().valid('Pending', 'Approved', 'Rejected').required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const registerUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  organization: Joi.string().required(),
  role: Joi.string().valid('Admin', 'Employee').default('Employee'),
  department: Joi.string().allow('', null)
});

module.exports = {
  registerVisitorSchema,
  updateAppointmentSchema,
  loginSchema,
  registerUserSchema
};
