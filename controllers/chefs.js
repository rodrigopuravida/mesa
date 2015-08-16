var express = require('express');
var router = express.Router();
var request = require('request');
var db = require("../models");
var session = require('express-session');
var flash = require('connect-flash');

router.use(session({
 secret:'lskdfjlasjdlfjlsdjflkdsjfksdjljlk',
 resave: false,
 saveUninitialized: true
}));
router.use(flash());
router.use(function(req,res,next){
 if(req.session.chef){
   db.chef.findById(req.session.chef).then(function(chef){
     req.currentChef = chef;
     next();
   });

 }else{
   req.currentChef = false;
   next();
 }
});
router.use(function(req,res,next){
 res.locals.currentChef = req.currentChef;
 res.locals.alerts = req.flash();
 next();
});


// View Signup Page
router.get("/signup", function(req, res){
        res.render('chefs/signup');
});

// Post Signup
router.post("/signup", function(req, res){
        db.chef.create({name: req.body.name,
                        rest_name: req.body.rest_name,
                        rest_location: req.body.email,
                        chef_bio: req.body.chef_bio,
                        chef_photo: req.body.chef_photo,
                        email: req.body.email,
                        password: req.body.password });
        res.redirect('login');
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
                        res.redirect('/chefs/' + req.session.chef + '/plates/new');
                        // res.redirect('currentChef.id/plates/new');
                }else{
                        req.flash('danger',"Sorry, we don't recognize that username and/or password");
                        res.redirect('login');
                }
                });

});

// Logout
router.get("/logout", function(req, res){
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
        var id = req.params.id;
        res.render('chefs/new', {chefId:id});
});
router.post("/:id/plates/new", function(req, res){
        var id = req.params.id;
         db.chef.findById(id).then(function(chef){
            chef.createPlate({
                name: req.body.name,
                description: req.body.description,
                photo: req.body.photo,
                deal: req.body.deal
                });
        });
                res.render('plates/new');
});

router.get("/:id/plates/index", function(req, res){
        var id = req.params.id;
        res.render('plates/index', {chefId:id});
});





















module.exports = router;