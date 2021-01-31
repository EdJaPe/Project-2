const { default: axios } = require('axios');
const express = require('express');
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();
const db = require("../models")




// router.get('/', (req, res) => {
//   axios.get(URL)
//     .then((response) => {
//       const recipes = response.data.hits
//       console.log('🌪',response)
//       res.render('recipes', { recipes: recipes });
//       // res.send(recipes)
//     })
//     .catch(function (error) {
//       console.log(error)

//     })
// })

// get/result - return a page with favorite Recipes
// router.get('/results', function (req, res) {
//   // TODO: Get all records from DB and render to view
//   // access the data from recipes data base
//   db.favorite.findAll()
//     .then(recipe => {
//       console.log('🥑', recipe)
//       res.render('favorite', { recipe: recipe })
//     })

// });

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
    where: {label: req.params.label}
  }).then(function(data){
    res.redirect('/recipes/favorites')
  });
});



// .then redirect to /results

// router.get('/:name')



module.exports = router;