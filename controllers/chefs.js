var express = require('express');
var router = express.Router();
var request = require('request');
var db = require("../models");

// View Signup Page
router.get("/signup", function(req, res){
        res.render('chefs/signup');
});

// Post Signup
router.post("/signup", function(req, res){
        res.redirect('chefs/login');
});

// View Login Page
router.get("/login", function(req, res){
        res.render('chefs/login');
});

// Post Login
router.post("/login", function(req, res){

        db.chef.authenticate(req.body.email,req.body.password,function(err,chef){
                if(err){
                        res.send(err);
                }else if(chef){
                        req.session.chef = chef.id;
                        req.flash('success','Welcome Chef.');
                        res.redirect('chefs/new');
                }else{
                        req.flash('danger',"Sorry, we don't recognize that username and/or password");
                        res.redirect('chefs/login');
                }
                });

});

// Post Logout
router.post("/logout", function(req, res){
        req.flash('info','Thanks, chef. Until we cook again!');
        req.session.user = false;
        res.redirect('/');
});

// View Chef Page-- This will not work until we pass information (params :id) in.
router.get("/:id/show", function(req, res){
        res.render('chefs/show');
});

// Follow Chef -- This will not work until we pass information (params :id) in.
router.post("/:id/show", function(req, res){
});

// Chef's Plates -- This will not work until we pass information (params :id) in.
router.get("/:id/plates/", function(req, res){
        res.render('chefs/index');
});

// New Plate For A Chef -- This will not work until we pass information (params :id) in.
router.get("/:id/plates/new", function(req, res){
        res.render('chefs/new');
});

module.exports = router;