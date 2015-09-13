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
   'local', {badRequestMessage:'please provide a valid email and password'},
   function(err,user,info){
     if(user){
       req.login(user,function(err){
         if(err) throw err;
         req.flash('success','hi '+ user.name);
         res.redirect('/plates/new');
       });
     }else{
       req.flash('danger',info.message || "oh no, something wen't wrong, please try again");
       res.redirect('/auth/login');
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
       req.flash('success','hi '+ user.name);
       res.redirect('/plates/new');
     });
   }else{
     req.flash('danger',info.message || "oh no, something wen't wrong, please try again");
     res.redirect('/auth/login');
   }
 })(req,res);
});

// Logout Route
router.get('/logout',function(req,res){
   req.logout();
   req.flash('info','goodbye, until we dine again!');
   res.redirect('/');
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