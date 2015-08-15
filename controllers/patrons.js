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

             db.patron.authenticate(req.body.email,req.body.password,function(err,patron){
                if(err){
                        res.send(err);
                }else if(patron){
                        req.session.patron = patron.id;
                        req.flash('success','Welcome Chef.');
                        res.redirect('plates/new');
                }else{
                        req.flash('danger',"Sorry, we don't recognize that username and/or password");
                        res.redirect('patrons/login');
                }
                });

});

// Post Logout
router.post("logout", function(req, res){
        req.flash('info','Thanks, patron. Until we dine again!.');
          req.session.user = false;
          res.redirect('/');
});

module.exports = router;