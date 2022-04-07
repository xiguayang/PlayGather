//Joi schema api validation
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.playgroundSchema = Joi.object({
    playground:Joi.object({
        title: Joi.string().required().escapeHTML(),
       // zipcode: Joi.number().required().min(5),
        //image: Joi.string().required(),
        address: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        devices: Joi.string().required().escapeHTML(),
        theme: Joi.string().escapeHTML()
    }).required(),
    deleteImages:Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})

// module.exports.childSchema = Joi.object({
//     child:Joi.object({
//         age: Joi.number().required().min(1).max(16),
//         gender: Joi.string().required().escapeHTML()
//     }).required()
// })

