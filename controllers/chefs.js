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
        res.redirect('chefs/new');
});

// Post Logout
router.post("/logout", function(req, res){
});

// View Chef Page-- This will not work until we pass information (params :id) in.
router.get("/:id/show", function(req, res){
        res.render('chefs/show');
});

// Follow Chef -- This will not work until we pass information (params :id) in.
router.post("/:id/show", function(req, res){
});

module.exports = router;