const Joi = require('joi')

const schemaAddContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
  phone: Joi.string().required()
})

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
  phone: Joi.string().optional()
}).min(1)

const validation = async (schema, object, next) => {
  try {
    await schema.validateAsync(object)
    return next()
  } catch (err) {
    next({ status: 400, message: err.message.replace(/"/g, "'") })
  }
}

const validationAddContact = async (req, res, next) => {
  return await validation(schemaAddContact, req.body, next)
}

const validationUpdateContact = async (req, res, next) => {
  return await validation(schemaUpdateContact, req.body, next)
}

module.exports = {
  validationAddContact,
  validationUpdateContact
}
