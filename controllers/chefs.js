var express = require('express');
var router = express.Router();
var request = require('request');
var db = require("../models");
var passport = require('passport');
var cloudinary = require('cloudinary').v2;
var uploads = {};

// View All Chefs
router.get("/", function(req, res){
    db.chef.findAll({
    include : [db.user]
  }).then(function(chef) {
    res.render('chefs/index', {chefs: chef});
      });
});

// View Chef Page
router.get("/:id/show", function(req, res){
    db.chef.find({
    where: {id: req.params.id},
    include : [db.user]
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
    chef.addUser(user).then(function(follow){
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
    chef.removeUser(user).then(function(follow){
      console.log('Following Chef')
    });
  });
res.redirect('/users/index');
});
console.log('boo unfollowing')
} else {
  res.redirect('/users/index')
}
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