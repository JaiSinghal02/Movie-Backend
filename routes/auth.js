const express=require('express')
const r=express.Router();
const mongoose=require('mongoose');
const bycrpt=require('bcrypt');
const {User}=require('../models/user');
const Joi=require('joi');
const jwt=require('jsonwebtoken');
const config=require('config');

r.post('/',async(req,res)=>{
    const {error}=validateBody(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user=await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send("Invalid email or password");

    const validPassword=await bycrpt.compare(req.body.password,user.password);
    if(!validPassword) return res.status(400).send("Invalid email or password");

    const token=user.getAuthToken();
    res.send(token);

})
function validateBody(body){
    const schema=Joi.object({
        email: Joi.string().min(11).required().email(),
        password: Joi.string().min(6).max(255).required()
    })
    return schema.validate(body);
}

module.exports=r;