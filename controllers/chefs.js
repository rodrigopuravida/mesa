var express = require('express');
var router = express.Router();
var request = require('request');
var db = require("../models");
var passport = require('passport');
var cloudinary = require('cloudinary').v2;
var uploads = {};
var twilio = require('twilio');


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

router.get("/plates/index", function(req, res){

console.log('I am in test mode');

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

  db.user.findAll().then(function(user){
    for(var i = 0; i < user.length; i++) {

    console.log(user[i].phone);
      var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      client.messages.create({

        to: user[i].phone,
        from: "+13852824298",
        body: "MESA Special of the Week from Chef" +  user[1].name,
        mediaUrl: "http://res.cloudinary.com/dpqunwmnb/image/upload/v1440020189/hmzhh6u9eo8ta926ohaf.jpg",
      }, function(err, message) {
        console.log(message.sid, err);
      });
    };
  });

    res.render('plates/index', {chefId:1});
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