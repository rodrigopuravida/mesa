var db = require('../models');
var express = require('express');
var router = express.Router();
var passport = require('passport');


// Signup Form Route
router.get('/signup',function(req,res){
   res.render('users/signup');
});

// Post Signup Form
router.post('/signup',function(req,res){
    db.user.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      isChef: req.body.chef
    }).then(function(user){
      if (user.isChef === true){
        db.chef.create({
          restaurant: req.body.restaurant,
          location: req.body.location,
          bio: req.body.bio,
          photo: req.body.photo,
          userId: user.id
        }).then(function(chef){
              res.redirect('login');
            });
      } else {
        res.redirect('login');
      }
    });
});

// Login Route
router.get('/login',function(req,res){
   res.render('users/login');
});

// Post Login
router.post('/login',function(req,res){
 passport.authenticate(
   'local', {badRequestMessage:'Please provide an email and password.'},
   function(err,user,info){
     if(user){
       req.login(user,function(err){
         if(err) throw err;
         req.flash('success','Welcome to Mesa!');
         res.redirect('/plates/new');
       });
     }else{
       req.flash('danger',info.message || 'Unknown error.');
       res.redirect('/atuh/login');
     }
   }
 )(req,res);
});

// Login Route for Facebook Auth
router.get('/login/:provider',function(req,res){
 passport.authenticate(
   req.params.provider,
   {scope:['public_profile','email']}
 )(req,res);
});

// Callback Route for Facebook Auth
router.get('/callback/:provider',function(req,res){
 passport.authenticate(req.params.provider,function(err,user,info){
   if(err) throw err;
   if(user){
     req.login(user,function(err){
       if(err) throw err;
       req.flash('success','Welcome to Mesa!');
       res.redirect('/plates/new');
     });
   }else{
     req.flash('danger',info.message || 'Unknown error.');
     res.redirect('/auth/login');
   }
 })(req,res);
});

// Logout Route
router.get('/logout',function(req,res){
   req.logout();
   req.flash('info','Goodbye, until we dine again!');
   res.redirect('/');
});


module.exports = router;