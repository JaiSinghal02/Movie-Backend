const mongoose = require('mongoose');
const Joi = require('joi');

const rentalSchema = mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                min: 5,
                max: 255
            },
            phone: {
                type: String,
                required: true,
                min: 10,
                max: 10
            },
            isGold: {
                type: Boolean,
                default: false
            }

        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                min: 5,
                max: 255,
                required: true
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0
            },

        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateIn: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0

    }
});

const Rental=mongoose.model('rental',rentalSchema);


function validateBody(body){
    return mongoose.Types.ObjectId.isValid(body.customerId) && mongoose.Types.ObjectId.isValid(body.movieId)
}

exports.Rental=Rental;
exports.validateBody=validateBody;