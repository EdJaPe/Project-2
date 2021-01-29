const { default: axios } = require('axios');
const express = require('express');
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
    db.recipe.findAll()
    .then( recipe => {
        // console.log('🥑', recipe)
        res.render('favorite', {recipe:recipe})
    })

});
router.post('/favorites', function(req, res) {
    //TODO: Send selected recipes to faveRecipes.ejs

    //saves favorite to db
    console.log('💪🏼',req.body)
    db.recipe.findOrCreate({
      where: {
        apiKey: req.body.apiKey
      }
    }).then((record) => {
        console.log('🚘', record[0].dataValues)
        console.log('👋🏼', req)
        db.usersrecipes.findOrCreate({
            where: {
              recipeId: record[0].dataValues.id,
               userId: req.user.dataValues.id
            }  
        }).then(association => {
          res.redirect('/favorites')
        }) 
    })
})



router.get('/favorites', function(req, res) {
  console.log('🤯',req.user)
  db.recipe.findAll({
    where: {
        userId:req.user.id
      }
      
    }).then((recipes) => {

      res.render('favorite', {recipe:recipes})
    }).catch(err => {
      console.log(err)
    })
  
})    

    // .then redirect to /results

// router.get('/:name')



module.exports = router;