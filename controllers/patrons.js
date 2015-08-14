var express = require('express');
var router = express.Router();
var request = require('request');
var db = require("../models");

// View Signup Page
router.get("/signup", function(req, res){
        res.render('patrons/signup');
});

// Post Signup
router.post("/signup", function(req, res){
        res.redirect('patrons/login');
});

// View Login Page
router.get("/login", function(req, res){
        res.render('patrons/login');
});

// Post Login
router.post("/login", function(req, res){
        res.render('plates/new');
});

// Post Logout
router.post("logout", function(req, res){
});

module.exports = router;