const Joi = require('joi')

const schemaUserSignup=Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  
})

const validation = async (schema, object, next) => {
  try {
    await schema.validateAsync(object)
    return next()
  } catch (err) {
    next({ status: 400, message: err.message.replace(/"/g, "'") })
  }
}

const validationUserSignup= async (req, res, next) => {
  return await validation(schemaUserSignup, req.body, next)
}

module.exports={validationUserSignup}