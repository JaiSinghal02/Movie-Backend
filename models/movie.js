const mongoose=require('mongoose');
const Joi=require('joi');
const {genreSchema}=require('./genre')



const Movies=mongoose.model('Movie',mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5
    },
    genre:{
        type: genreSchema
    },
    numberInStock: {
        type: Number,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        default: 0
    }
}));

function validateBody(body){
    const schema=Joi.object({
        title: Joi.string().required().min(5),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    })
    return schema.validate(body);
}

exports.Movies=Movies;
exports.validateBody=validateBody;