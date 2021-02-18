const exp = require('express');
const router = exp.Router();
const mongoose = require('mongoose');
const {Genres,getGenres,getGenresById,createGenres,updateGenres,deleteGenres,validateBody,validateBodyUpdate,validateId}=require('../models/genre');
const auth=require('../middleware/authorise');
const admin = require('../middleware/admin');

router.get('/', async (req, res,next) => {
    try {
        const genre = await Genres.find().select({__v: 0 });
        return res.send(genre);
        //return res.send("Empty database...")
    }
    catch (err) {
        next(err);
    }
})
router.get('/:id', (req, res) => {
    const movie = validateId({ id: req.params.id });
    //console.log(movie);
    if (movie.error) {
        console.log("ID dailed", movie.error.message);
        return res.status(404).send(`Id: ${req.params.id} is not a valid id`)
    };

    getGenresById(req.params.id, res)
        .then((movie) => {
            if (movie) res.send(movie);
            else res.status(404).send(`Movie with id:${req.params.id} not found`);
            //console.log(movie);
        });



})

//post request
router.post('/',auth, (req, res) => {
    const { error } = validateBody(req.body);
    //console.log(error);
    if (error) return res.status(400).send(error.details[0].message);

    createGenres(req, res);

});

//put request
router.put('/:id',auth, (req, res) => {
    const { error } = validateBodyUpdate(req.body);
    //console.log(error);
    if (error) res.status(400).send(error.details[0].message);

    updateGenres(req.params.id, req.body, res);


})

//delete request
router.delete('/:id',[auth,admin], (req, res) => {
    const movie = validateId({ id: req.params.id });
    if (movie.error) res.status(404).send(`Id: ${req.params.id} is not a valid id`);

    deleteGenres(req.params.id, res);
});
//-------------------------------------------------------------------------------------------------------------------------








module.exports = router;