const { default: axios } = require('axios');
const express = require('express');
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();
const db = require("../models")
const API_ID = process.env.API_ID;
const API_KEY = process.env.APPLICATION_KEY;
const URL = `https://api.edamam.com/search?q=vegan&app_id=${API_ID}&app_key=${API_KEY}&from=0&to=30`;




//GET ROUTES
router.get('/favorites', isLoggedIn, function (req, res) {
  console.log('🤯', req.user)
  db.user.findOne({
    where: {
      id: req.user.dataValues.id
    },
    include: [db.favorite]
  }).then((recipes) => {
    console.log('🌶', recipes)
 
    res.render('favorite', { recipes: recipes.dataValues.favorites })
  }).catch(err => {
    console.log(err)
  })
})

router.get('/usersrecipe/:id', (req,res) => {
  console.log('🐠',req.params)
  db.createdRecipe.findOne({
    where:{
      id:req.params.id
    }
  }).then((newRecipe) => {
    console.log('👽',newRecipe)
    res.render('showRecipe',{newRecipe:newRecipe})
  })
  
})

router.get('/usersrecipe', isLoggedIn, function(req, res) {
  console.log('🌎', req.body)
  db.createdRecipe.findAll({
    where: {
      userId:req.user.id
    }
  }).then((createdRep) => {
    console.log('🌈',createdRep)
    res.render('usersRecipes', {created: createdRep})

  }).catch(error => {
    console.log(error)
  })
})


router.get('/create', (req,res) =>{
    res.render('createRecipe')
})


router.post('/create', isLoggedIn, (req,res) =>{
  db.createdRecipe.findOrCreate({
    where: {
      userId: req.body.userId,
      name: req.body.recipe,
      ingredients: req.body.ingredients,
      directions: req.body.directions
    },
  }).then(([newRecipe, created]) => {
    console.log(newRecipe)
    res.redirect('/recipes/usersrecipe')
  })
})

// I left  off  here Jan 30 2021👀
router.get('/results/:uri', (req,res) => {
  console.log('🦋', req.params.uri)
  const label = encodeURIComponent(req.params.uri);
  // let label = 'Raw Vegan Coconut Almond Macaroons'
  // let ingredient1 = '+'+req.query.searchInput1
  // let ingredient2 = '+'+req.query.searchInput2
  // console.log(req.body)
  let infoURL = `https://api.edamam.com/search?r=${label}&app_id=${API_ID}&app_key=${API_KEY}`

  // console.log(req.body)
  // let infoURL = `${URL}&label=${label}`
  axios.get(infoURL).then(infoResponse => {
    console.log('💄',infoResponse)
    res.render('showResults',{result: infoResponse.data[0]})
  }).catch(err => {
    console.log(err)
  })
});

//POST ROUTES
router.post('/favorites', isLoggedIn, function (req, res) {
  //TODO: Send selected recipes to faveRecipes.ejs

  //saves favorite to db
  console.log('💪🏼', req.body)
  db.favorite.findOrCreate({
    where: {
      
      userId: req.body.userId,
      label: req.body.label,
      uri: req.body.uri,
      image: req.body.image
    },
    // include:[db.user]
  }).then(([record, created]) => {
    console.log('🚘', record)
    // console.log('👋🏼', req)
    // db.usersfavorites.findOrCreate({
    //     where: {
    //       favoritesId: record.dataValues.id,
    //        userId: req.user.dataValues.id
    //     }  
    // })
    // .then(association => {
    res.redirect('/recipes/favorites')
    // }) 
  })
})

router.delete('/favorites/:label', function(req,res) {
  db.favorite.destroy({
    where: {
      label: req.params.label
    }
  }).then(function(data){
    res.redirect('/recipes/favorites')
  });
});
router.delete('/usersrecipe/:name', function(req,res) {
  console.log('🐸',req.params.name)
  db.createdRecipe.destroy({
    where: {
      name: req.params.name
    }
  }).then(function(data){
    console.log('⛑',data)
    res.redirect('/recipes/usersrecipe')
  });
});


// .then redirect to /results

// router.get('/:name')



module.exports = router;