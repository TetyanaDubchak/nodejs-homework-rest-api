const Joi = require('joi');

const auchSchema = Joi.object({
    password: Joi.string()
        .min(2)
        .max(20)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required(),

})

module.exports = auchSchema