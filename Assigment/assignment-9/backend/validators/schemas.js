const Joi = require('joi');

const registerVisitorSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  company: Joi.string().allow('', null),
  photoUrl: Joi.string().allow('', null),
  role: Joi.string().valid('Visitor').default('Visitor')
});

const appointmentVisitorSchema = Joi.object({
  hostId: Joi.string().required(),
  date: Joi.date().iso().required(),
  email: Joi.string().email().required(),
  purpose: Joi.string().required(),
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
  role: Joi.string().valid('Admin', 'Employee').default('Employee'),
  department: Joi.string().allow('', null)
});

module.exports = {
  registerVisitorSchema,
  appointmentVisitorSchema,
  updateAppointmentSchema,
  loginSchema,
  registerUserSchema
};
