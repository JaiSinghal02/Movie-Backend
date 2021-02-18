const express=require('express');
const r=express.Router();
const mongoose=require('mongoose');
const {Movies,validateBody}=require('../models/movie');
const {Genres}=require('../models/genre');

r.get('/',async(req,res)=>{
    const movie=await Movies.find().select('-__v').sort('title');
    res.send(movie);
});


r.get('/:id',async(req,res)=>{
    try{
    const movie=await Movies.findById(req.params.id);
    if(!movie) res.send(`No movie found with id: ${req.params.id} ....`);
    res.send(movie);}
    catch(err){
        res.send(err.message);
    }
});

r.post('/',async(req,res)=>{
    const {error}=validateBody(req.body);
    if(error) return res.send(error.details[0].message);
    

    const genre=await Genres.findById(req.body.genreId);
    //console.log(genre.name)
    if(!genre) return res.status(400).send("No genre with given id");
    let movie= new Movies({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate

    });

    try{
        movie=await movie.save();
        res.send(movie);
    }
    catch(err){
        res.send(err.message);
    }


})

module.exports =r;
