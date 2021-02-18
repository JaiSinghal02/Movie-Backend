const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255
    }
});

const Genres = mongoose.model('Genre', genreSchema);

//-----Database fucntions-----

async function getGenres(res) {
    
};
async function getGenresById(id, res) {
    try {
        const genre= await Genres
            .findById({ _id: id })
            .sort({ name: 1 })
            res.send(genre);
        //console.log(!movie);
    }
    catch (ex) {
        res.status(404).send(ex);
        
    }
};

async function createGenres(obj, res) {
    try {
        const genre = new Genres({
            name: obj.body.name,
        });

        const result = await genre.save();
        console.log('Genre Added..', result);
        res.send(result);
    }
    catch (err) {
        res.send(err.message);
    }
};

async function updateGenres(id, body, res) {
    try {
        const old = await Genres.findById(id);
        const genre = await Genres.findByIdAndUpdate(id,{
            $set:{
                name: body.name == null ? old.name : body.name},
            new: true})
        res.send(genre);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

async function deleteGenres(id, res) {
    try{
    const genre = await Genres.findByIdAndRemove({ _id: id });
    if (genre) {
        res.status(200).send(genre);
        console.log("Deletion successful");
    }
    else {
        res.send("Genre not found..");
        console.log("Deletion Unsuccessful...");
    }}
    catch(err){
        res.status(400).send(err.message)
    }

}


// Name validate function
function validateBody(body) {
    const schema = Joi.object({
        name: Joi.string().min(4).required()
    });
    return schema.validate(body);
}
function validateBodyUpdate(body) {
    const schema = Joi.object({
        name: Joi.string().min(4)
    });
    return schema.validate(body);
}


//Id Validate function
function validateId(re) {
    const schema = Joi.object({
        id: Joi.string().min(24)
    })
    //console.log(schema.validate(re),re);
    return schema.validate(re);
}

exports.Genres = Genres;
exports.getGenres = getGenres;
exports.getGenresById = getGenresById;
exports.createGenres = createGenres;
exports.updateGenres = updateGenres;
exports.deleteGenres = deleteGenres;
exports.validateBody = validateBody;
exports.validateBodyUpdate = validateBodyUpdate;
exports.validateId = validateId;
exports.genreSchema = genreSchema;

