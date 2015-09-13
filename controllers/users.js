var express = require('express');
var router = express.Router();
var request = require('request');
var db = require("../models");
var session = require('express-session');
var flash = require('connect-flash');

router.get('/index', function(req, res){
        res.render('users/index')
})

// User Show
router.get("/show", function(req, res) {
    db.user.find({
        where: {id: req.user.id},
        include: [db.chef]
    }).then(function(user) {
        res.render('users/show', {user:user})
     });
});

// Edit User Page
router.get("/edit", function(req, res){
        thisUser = req.user
        if (thisUser.isChef === true){
                db.chef.find({
                        where: {userId: thisUser.id},
                        include: [db.user]
                }).then(function(chef){
                        res.render('users/edit', {mychef: chef});
                });
        } else {
            db.user.findById(thisUser.id).then(function(user){
                       res.render('users/edit', {mychef: user});
                   });
        }
        // res.redirect('/')
});

// Edit User Page Post
router.post("/edit", function(req, res){
        thisUser = req.user
        if (thisUser.isChef === true){
                db.chef.find({
                        where: {userId: thisUser.id},
                        include: [db.user]
                }).then(function(chef){
                        chef.user.name = req.body.name;
                        chef.user.email =req.body.email;
                        chef.user.phone = req.body.phone;
                        chef.user.isChef =req.body.chef;
                        chef.restaurant = req.body.restaurant;
                        chef.location = req.body.location;
                        chef.bio = req.body.bio;
                        chef.photo = req.body.photo;
                        chef.save().then(function(chef){
                                chef.user.save().then(function(chef){
                                          res.redirect('/');
                                });
                        });
                });
        } else if ((thisUser.isChef === null) || (thisUser.isChef === false)) {
              db.user.findById(thisUser.id).then(function(user){
                        user.name = req.body.name;
                        user.email =req.body.email;
                        user.phone = req.body.phone;
                        user.isChef = req.body.chef;
                        user.save().then(function(user){
                            if (user.isChef === true){
                                 db.chef.findOrCreate({
                                where: {userId: thisUser.id}
                            }).spread(function(chef, created){
                                    res.redirect('/users/edit');
                                });
                        } else {
                            res.redirect('/users/edit');
                        }
                                });
                    });
         }
        // res.redirect('/')
});

module.exports = router;