require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const passport = require('./config/ppConfig');

const isLoggedIn = require('./middleware/isLoggedIn');
const app = express();
const methodOverride = require('method-override');
const SESSION_SECRET = process.env.SESSION_SECRET;
const API_ID = process.env.API_ID;
const API_KEY = process.env.APPLICATION_KEY;
const URL = `https://api.edamam.com/search?q=vegan&app_id=${API_ID}&app_key=${API_KEY}&from=0&to=30`;
const axios = require('axios');


app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(layouts);
app.use(helmet());

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Init passport config MUST HAPPEN AFTER SESSION CONFIG
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Write Custom Middleware to access the user on every response
app.use((req, res, next) => {
  let alerts = req.flash();
  console.log(alerts);
  res.locals.alerts = alerts;
  res.locals.currentUser = req.user;
  next();
});
// set a route for index page AKA home
app.get('/', (req, res) => {
  res.render('index');
});


//set up a search Route 
// app.get('/search', (req, res) => {
//   res.render('search');
// })
// Set up a recipe page 




  
app.get('/results', isLoggedIn, (req, res) => {
  
  let ingredient1 = '+'+req.query.searchInput1
  let ingredient2 = '+'+req.query.searchInput2
  // console.log(req.body)
  let searchURL = `https://api.edamam.com/search?q=vegan${ingredient1}${ingredient2}&app_id=${API_ID}&app_key=${API_KEY}&from=0&to=30`
  // console.log(req) 
 // Use request to call the API
  axios.get(searchURL).then(apiResponse => {
    console.log('🌤', apiResponse.data.hits)
    // let recipes = apiResponse;
    res.render('results', {results: apiResponse.data.hits});
  })
});

// app.get('/recipes/:id', (req, res) => {
   
//   res.render('show');
// });





app.get('/search', (req, res) => {
   
    res.render('search');
});


app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

// app.use('/favorites', require('./routes/favorites'));
app.use('/recipes', require('./routes/recipes'));
app.use('/auth', require('./routes/auth'));
// app.use('/dino', isLoggedIn, require('./routes/dinos'));

var server = app.listen(process.env.PORT || 3000, ()=> console.log(`🎧You're listening to the smooth sounds of port ${process.env.PORT || 3000}🎧`));

module.exports = server;