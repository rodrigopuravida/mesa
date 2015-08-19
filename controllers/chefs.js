var express = require('express');
var router = express.Router();
var request = require('request');
var db = require("../models");
var passport = require('passport');
var cloudinary = require('cloudinary').v2;
var uploads = {};


// View Chef Page-- This will not work until we pass information (params :id) in.
router.get("/:id/show", function(req, res){
        res.render('chefs/show');
});

// Follow Chef
router.post("/:id/show", function(req, res){
  // if (patron){
  // db.patron.findOrCreate({
  //   where: {id: req.session.patron}
  // }).spread(function(patron, created){
  //   db.chef.findById({
  //     where: {id: req.params.id}
  // }).then(function(chef){
  //     db.chef.findById({ where: {id: req.params.id}
  // }).then(function(chef) {
  //   chef.addPatron(patron).then(function(follow){
  //     console.log('Following Chef')
  //   })
  //   res.render('chefs/:id/show', {mychef: chef});
  // } else {
     res.render('chefs/:id/show', {mychef: chef});
  // }
});

// Unfollow Chef
router.post("/:id/show", function(req, res){
  // if (patron){
  // db.patron.findOrCreate({
  //   where: {id: req.session.patron}
  // }).spread(function(patron, created){
  //   db.chef.findById({
  //     where: {id: req.params.id}
  // }).then(function(chef))})
  //   db.chef.findById({ where: {id: req.params.id}
  // }).then(function(chef) {
  //   chef.removePatron(patron).then(function(unfollow){
  //     console.log('No Longer Following Chef')
  //   })
  //   res.render('chefs/:id/show', {mychef: chef});
  // } else {
     res.render('chefs/:id/show', {mychef: chef});
  // }
});

// List All of Chef's Plates
router.get("/:id/plates/index", function(req, res){
        var id = req.params.id;
        res.render('plates/index', {chefId:id});
});

// New Plate For A Chef
router.get("/plates/new", function(req, res){
        id = req.user
        res.render('chefs/new', {
          chefId:id,
          cloudName:process.env.CLOUDINARY_CLOUD_NAME,
         preset:process.env.CLOUDINARY_UPLOAD_PRESET
        });
});

// Chef Posts A Post New Plate
router.post("/plates/new", function(req, res){
        var id = req.user.id

//Cloudinary Upload Section
        // console.log('I am at create stage of plate past Cloudinary upload');
         db.chef.find({
          where: {userId: id}
        }).then(function(chef){
            chef.createPlate({
                name: req.body.name,
                description: req.body.description,
                photo: req.body.photo,
                deal: req.body.deal
                });
        });
        res.render('plates/new');
});

function waitForAllUploads(id,err,image){
   uploads[id] = image;
   var ids = Object.keys(uploads);
   if (ids.length==6){
     console.log();
     console.log ('**  uploaded all files ('+ids.join(',')+') to cloudinary');
     performTransformations();
   }
 }

module.exports = router;