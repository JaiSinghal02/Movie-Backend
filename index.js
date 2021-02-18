const exp=require('express');
const app=exp();
const Joi=require('joi');
const logger=require('./middleware/logger');
//const authorise=require('./middleware/authorise');
const startupDebug=require('debug')('app:startup');
const dbDebug=require('debug')('app:db'); //In cmd use set DEBUG=app:startup or set DEBUG=app:db or set DEBUG=app:* to see debug msgs
const genre=require('./routes/genres');
const home=require('./routes/home');
const customers=require('./routes/customers');
const movies=require('./routes/movies')
const rental=require('./routes/rentals');
const user=require('./routes/users');
const mongoose=require('mongoose');
const auth=require('./routes/auth');
const Fawn=require('fawn');
const config=require('config');
const error=require('./middleware/error');
const winston=require('winston');


// if(!config.get('jwtPrivateKey')){
//     console.error('FATAL ERROR: jwtPrivateKey is not set');
//     process.exit(1);
// }

winston.add(new winston.transports.File({filename: 'logfile.log'}));

Fawn.init(mongoose);

mongoose.connect('mongodb://localhost/movie-data',{useNewUrlParser:true,useUnifiedTopology: true })
 .then(()=> console.log('Connected to mongodb server...'))
 .catch(err=> console.error('Error connecting:',err.message));

app.set('view engine','pug');
app.set('views','./views');

app.use(exp.json());
app.use(logger);            //custom middleware function
//app.use(authorise);      //custom middleware function
app.use(exp.urlencoded());  // for url containing form key and value
app.use(exp.static('./public'));
app.use('/api/genres',genre);
app.use('/',home);
app.use('/api/customers',customers);
app.use('/api/movies',movies);
app.use('/api/rentals',rental);
app.use('/api/users',user);
app.use('/api/auth',auth);

app.use(error);

startupDebug("This is the startup debug msg");
dbDebug("This is the db debug msg");


const port=process.env.PORT || 3000;
app.listen(3000, (req,res)=>{
    console.log(`Surver running at ${port}...`);
})


