var express = require('express');
var router = express.Router();
var request = require('request');
var db = require("../models");
var session = require('express-session');
var flash = require('connect-flash');

// View Login Page
router.get("/login", function(req, res){
        res.render('users/login');
});

// // View Signup Page
// router.get("/signup", function(req, res){
//         res.render('users/signup');
// });

// // Post Signup
// router.post("/signup", function(req, res){
//         db.user.create({
//             email: req.body.email,
//             password: req.body.password,
//             phone: req.body.phone
//         });
//         res.redirect('login');
// });


// router.use(session({
//  secret:'hdkfjhsdkhfksdhfhdpfhpsdkfhskdjfh',
//  resave: false,
//  saveUninitialized: true
// }));
// router.use(flash());
// router.use(function(req,res,next){

//  if(req.session.patron){
//    db.patron.findById(req.session.patron).then(function(patron){
//      req.currentPatron = patron;
//      next();
//    });

//  }else{
//    req.currentPatron = false;
//    next();
//  }
// });
// router.use(function(req,res,next){
//  res.locals.currentPatron = req.currentPatron;
//  res.locals.alerts = req.flash();
//  next();
// });





// // Post Login
// router.post("/login", function(req, res){

//              db.patron.authenticate(req.body.email,req.body.password,function(err,patron){
//                 if(err){
//                         res.send(err);
//                 }else if(patron){
//                         req.session.patron = patron.id;
//                         req.flash('success','Welcome patron.');
//                         res.redirect('/plates/new');
//                 }else{
//                         req.flash('danger',"Sorry, we don't recognize that username and/or password");
//                         res.redirect('login');
//                 }
//                 });

// });

// // Logout
// router.get("/logout", function(req, res){
//         req.flash('info','Thanks, patron. Until we dine again!.');
//           req.session.patron = false;
//           res.redirect('/');
// });

module.exports = router;