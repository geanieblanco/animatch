
var express = require('express');
var router = express.Router();
//var queries = require('../models/pets.js');
var queries = require("../models");

var request = require('request');
var apikey = "8c46a80af9f4501e366c726a72006ad8";
var secret = "041e4b5e005bf0fe3dce1929e5d7813b";

//html render
router.get("/login",(req,res)=> {
    res.render("login");
})

router.get("/create-account", (req, res) => {
  res.render("newuser");
})

router.get("/quiz", (req, res) => {
  res.render("quiz", {
    css: "quiz.css"
  });
});

router.get("/account", (req, res) => {
  res.render("account");
  // if (auth) {
  //   res.render("account");
  // } else {
  //   res.render("login");
  // }
});

router.get("/shelters", (req, res) => {
  res.render("shelter");
});

router.get("/home", (req, res) => {
  res.render("index");
});


router.get('/', function (req, res) {
    res.render('index');
});



// api router
  //get bread list
  router.get("/api/pets/:animal", function(req,res){
     var url = "http://api.petfinder.com/breed.list?format=json&key=";
     var animal = req.params.animal;

     url += apikey;
     url += `&animal=${animal}`

     //console.log("this is the " + url)

     request(url, function(error, response, body){
       var allResults = JSON.parse(body);
       var resultArray = allResults.petfinder.breeds
       res.json(resultArray)
     })

  })

  //return specific animals
  router.get("/api/pets/:animal/:breed/:size/:location/:age/:sex", function(req,res){
   var url = "http://api.petfinder.com/pet.find?format=json&key=";

    url += apikey;

    //check whether the input is made from users and add to url
    for(var key in param){
      if(param[key] != "undefined"){
        url += `&${key}=${param[key]}`
      }
    }

    request(url, function(error, response, body){
      var results = JSON.parse(body)
      var status = results.petfinder.header.status
      var list = results.petfinder.pets
      console.log(list);
      res.json(list);
    })
  })


//for user information

  router.get("/api/user/:id", function(req,res){
    //list all the favorate animals
    console.log("ere")
    queries.User.findOne({
      where:{
        id:req.params.id
      },
      include:[queries.Pet]
    }).then(function(data){
      var allAnimals = data.pets;
      res.json(allAnimals);

    })
  })

  //create new user file
  router.put("/api/users", function(req,res{
    queries.User.create(req.body).then(function(data){
      res.json(data);
    })
  }))

module.exports = router;
