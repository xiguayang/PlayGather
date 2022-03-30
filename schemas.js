//Joi schema api validation
const Joi = require('joi');

module.exports.playgroundSchema = Joi.object({
    playground:Joi.object({
        title: Joi.string().required(),
       // zipcode: Joi.number().required().min(5),
        //image: Joi.string().required(),
        address: Joi.string().required(),
        description: Joi.string().required(),
        devices: Joi.string().required(),
        theme: Joi.string()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
})