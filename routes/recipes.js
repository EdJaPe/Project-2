const { default: axios } = require('axios');
const express = require('express');
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();
const db = require("../models")




router.get('/', (req, res)=> {
    axios.get(URL)
      .then((response) => {
        const recipes = response.data.hits
        console.log(response)
        res.render('recipes', {recipes: recipes});
        // res.send(recipes)
      })
      .catch(function(error) {
        console.log(error)
      
      })
  }) 

// get/result - return a page with favorite Recipes
router.get('/results', function(req, res) {
    // TODO: Get all records from DB and render to view
    // access the data from recipes data base
    db.favorite.findAll()
    .then( recipe => {
        // console.log('🥑', recipe)
        res.render('favorite', {recipe:recipe})
    })

});
router.get('/favorite', isLoggedIn, function(req, res) {
  // console.log('🤯',req.user)
  db.user.findOne({
    where: {
        id:req.user.id
      },
      include:[db.favorite]
  }).then((recipes) => {
    console.log('🌶',recipes)
      res.render('favorite', {recipe:recipes})
    }).catch(err => {
      console.log(err)
    })
  
})    

router.post('/favorites', function(req, res) {
    //TODO: Send selected recipes to faveRecipes.ejs

    //saves favorite to db
    console.log('💪🏼',req.body)
    db.favorite.findOrCreate({
      where: {
        //uri.split('#recipe_').pop()
        // then interpolate the above value into api call
       // https://api.edamam.com/search?r=http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_${poped ******id****** }&app_id=47fa9ac2&app_key=4a306ee0ff5a0b8b0b2574b82f27b07b
      label:req.body.label,
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
           res.redirect('/recipes/favorite')
        // }) 
    })
})




    // .then redirect to /results

// router.get('/:name')



module.exports = router;