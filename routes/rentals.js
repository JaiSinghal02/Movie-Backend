const express=require('express');
const r=express.Router();
const mongoose=require('mongoose');
const {Rental,validateBody}=require('../models/rental');
const {Customers}=require('../models/customer');
const {Movies}=require('../models/movie');
const Fawn=require('fawn');


r.get('/',async(req,res)=>{
    try{
        return res.send(await Rental.find().sort('customer.name'));
    }
    catch(err){
        return res.status(400).send(err.message);
    }
})

r.post('/',async(req,res)=>{
    const error=validateBody(req.body);
    if(!error) return res.status(400).send("Enter valid Id");

    const customer=await Customers.findById(req.body.customerId);
    if(!customer) return res.status(400).send("Invalid customer");
    const movie=await Movies.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie');

    if(movie.numberInStock==0) return res.status(400).send("Movie out of stock");
    //console.log(customer,movie);
    let rental=new Rental({
        customer:{
            _id:customer._id,
            name:customer.name,
            phone:customer.phone,
            isGold:customer.isGold
        },
        movie:{
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    try{
        new Fawn.Task()
            .save('rentals',rental)
            .update('movies',{_id:movie._id},{
                $inc : {numberInStock:-1}
            })
            .run()
            .then(()=>{
                console.log("Save successful...");
            })
        res.send(rental);
    }
    catch(ex){
        res.status(500).send('Operation failed...');
    }
})


module.exports =r;