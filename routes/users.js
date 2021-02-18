const bcrypt=require('bcrypt');
const _=require('lodash');
const express=require('express');
const r=express.Router();
const mongoose=require('mongoose');
const {User,validateBody}=require('../models/user');
const auth=require('../middleware/authorise');


r.get('/me',auth,async(req,res)=>{
    const user=await User.findById(req.user._id).select('-password -__v');
    res.send(user);
})

r.post('/',async(req,res)=>{
    const {error}=validateBody(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user=await User.findOne({email:req.body.email})
    if(user) return res.status(400).send("User already registered");

    user=new User(_.pick(req.body,['name','email','password']));
    const salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password,salt);
    user=await user.save();
    const token=user.getAuthToken();
    res.header('x-auth-token',token).send(_.pick(user,['_id','email','name']));

})

module.exports=r;