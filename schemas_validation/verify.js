const Joi = require('joi');

const verifySchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required(),

})

module.exports = verifySchema