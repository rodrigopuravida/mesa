
//cloudinary section
// var dotenv = require('dotenv');
// dotenv.load();
var fs = require('fs');
var cloudinary = require('cloudinary').v2;
var uploads = {};
//end of cloudinary section

var express = require('express');
var router = express.Router();
var request = require('request');
var db = require("../models");
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;

router.use(session({
 secret:'lskdfjlasjdlfjlsdjflkdsjfksdjljlk',
 resave: false,
 saveUninitialized: true
}));

router.use(passport.initialize());
router.use(passport.session());

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

//serialize chef
 passport.serializeUser(function(chef, done) {
  done(null, chef.id);
});

//deserialize chef
passport.deserializeUser(function(id, done) {
  db.chef.findById(id).then(function(chef) {
    done(null, chef.get());
  }).catch(done);
});

passport.use(new LocalStrategy({
   usernameField:'email'
 },
 function(email,password,done){
   db.chef.find({where:{email:email}}).then(function(chef){
     if(chef){
       //found the chef
       chef.checkPassword(password,function(err,result){
         if(err) return done(err);
         if(result){
           //good password
           done(null,chef.get());
         }else{
           //bad password
           done(null,false,{message: 'Invalid Password.'});
         }
       });
     }else{
       //didn't find the chef
       done(null,false,{message: 'Unknown chef. Please sign up.'});
     }
   });
 }
));



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

    passport.authenticate(
   'local',
   {badRequestMessage:'You must enter e-mail and password.'},
   function(err,chef,info){
     if(chef){
       req.login(chef,function(err){
         if(err) throw err;
         req.flash('success','You are now logged in.');
         res.redirect('/chefs/' + req.session.chef + '/plates/new');
       });
     }else{
       req.flash('danger',info.message || 'Unknown error.');
       res.redirect('login');
     }
   }
 )(req,res);

        // db.chef.authenticate(req.body.email,req.body.password,function(err,chef){
        //         if(err){
        //                 res.send(err);
        //         }else if(chef){
        //                 req.session.chef = chef.id;
        //                 req.flash('success','Welcome Chef.');
        //                 res.redirect('/chefs/' + req.session.chef + '/plates/new');
        //                 // res.redirect('currentChef.id/plates/new');
        //         }else{
        //                 req.flash('danger',"Sorry, we don't recognize that username and/or password");
        //                 res.redirect('login');
        //         }
        //         });

});

// Logout
router.get("/logout", function(req, res){

   req.logout();
   req.flash('info','You have been logged out.');
   res.redirect('/');

        // req.flash('info','Thanks, chef. Until we cook again!');
        // req.session.user = false;
        // res.redirect('/');
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


        res.render('chefs/new', {chefId:id, cloudName:process.env.CLOUDINARY_CLOUD_NAME,
         preset:process.env.CLOUDINARY_UPLOAD_PRESET
        });
          console.log(process.env.CLOUDINARY_CLOUD_NAME);
         console.log(process.env.CLOUDINARY_UPLOAD_PRESET);
});
router.post("/:id/plates/new", function(req, res){
        var id = req.params.id;

//cloudinary upload section



    console.log('My Photo:');
    console.log(req.body);

        //waiting of creation of plate
        console.log('I am at create stage of plate past Cloudinary upload');
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