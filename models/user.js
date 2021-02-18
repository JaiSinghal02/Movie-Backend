const mongoose=require('mongoose');
const Joi=require('joi');
const jwt=require('jsonwebtoken');

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:5,
        max:255
    },
    email:{
        type:String,
        unique:true,
        min:11,
        required:true
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:1024
    },
    isAdmin: Boolean
});
userSchema.methods.getAuthToken=function() {
    const token=jwt.sign({_id:this._id,isAdmin: this.isAdmin},'aSecretPassword'); //jsonwebtoken private key is hard coded but learn to use environment variable for it
    return token;
}
const User=mongoose.model('user',userSchema);

function validateBody(body) {
    const schema=Joi.object({
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(11).required().email(),
        password: Joi.string().min(6).max(255).required()
    })
    return schema.validate(body);
}

exports.User=User;
exports.validateBody=validateBody;