const mongoose=require('mongoose');
const Joi = require('joi');

const Customers = mongoose.model('Customer', mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        set: v => Math.round(v),
        default: null
    }
}));


function validateBody(body) {
    const schema = Joi.object({
        isGold: Joi.bool(),
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(10)
    });
    return schema.validate(body);

}

function validateUpdateBody(body) {
    const schema = Joi.object({
        isGold: Joi.bool(),
        name: Joi.string().min(3),
        phone: Joi.string().min(3)
    });
    return schema.validate(body);
}

exports.Customers = Customers;
exports.vaildateBody=validateBody;
exports.validateUpdateBody=validateUpdateBody;