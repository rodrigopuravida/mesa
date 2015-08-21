var express = require('express');
var router = express.Router();
var request = require('request');
var db = require("../models");
var passport = require('passport');
var cloudinary = require('cloudinary').v2;
var uploads = {};
var twilio = require('twilio');

// View All Chefs
router.get("/", function(req, res){
    db.chef.findAll({
    include : [db.user, db.plate]
  }).then(function(chef) {
    res.render('chefs/index', {chefs: chef});
      });
});

// View Chef Page
router.get("/:id/show", function(req, res){
    db.chef.find({
    where: {id: req.params.id},
    include : [db.user, db.plate]
  }).then(function(chef) {
    res.render('chefs/show', {chef: chef});
      });
});

// Follow Or Unfollow Chef
router.post("/:id/show", function(req, res){
if (req.body.toggle === 'follow'){
db.user.find({
  where: {id: req.user.id}
}).then(function(user){
  db.chef.find({
    where: {id: req.params.id}
}).then(function(chef){
    user.addChef(chef).then(function(follow){
      console.log('Following Chef')
    });
  });
res.redirect('/users/index');
});
console.log('yay following')
} else if  (req.body.toggle === 'unfollow'){
db.user.find({
  where: {id: req.user.id}
}).then(function(user){
  db.chef.find({
    where: {id: req.params.id}
}).then(function(chef){
    user.removeChef(chef).then(function(unfollow){
      console.log('no longer Following Chef')
    });
  });
res.redirect('/users/index');
});
console.log('boo unfollowing')
} else {
  res.redirect('/users/index')
}
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
        console.log(req.user)
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
        res.redirect('/plates/new');
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