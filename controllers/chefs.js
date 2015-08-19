
//cloudinary section
// var dotenv = require('dotenv');
// dotenv.load();
var fs = require('fs');
var twilio = require('twilio');
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
var FacebookStrategy = require('passport-facebook').Strategy;
var BASE_URL =  'http://localhost:3000';

var patronNumbers = [];


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
    // console.log('my' + chef.id + 'is awesome');
     if(chef){
      // req.session.chef = chef.id;
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
 // console.log(process.env.FACEBOOK_APP_ID);
 //  console.log(process.env.FACEBOOK_APP_SECRET);

passport.use(new FacebookStrategy({
 clientID: process.env.FACEBOOK_APP_ID,
 clientSecret: process.env.FACEBOOK_APP_SECRET,

 callbackURL: BASE_URL + '/chefs/callback/facebook/',
 profileFields: ['email','displayName'],
 enableProof: true
},function(accessToken, refreshToken, profile, done){
 db.providerChef.find({
   where:{
     pid:profile.id,
     // type:profile.provider
   },
   include:[db.chef]
 }).then(function(providerChef){
   if(providerChef && providerChef.chef){
     //login
     providerChef.token = accessToken;
     providerChef.save().then(function(){
       done(null,providerChef.chef.get());
     });
   }else{
     //signup
     // console.log(profile);
     var email = profile.emails[0].value;
     db.chef.findOrCreate({
       where:{email:email},
       defaults:{email:email,name:profile.displayName}
     }).spread(function(chef,created){
       if(created){
         //chef was created
         chef.createProviderChef({
           pid:profile.id,
           token:accessToken,
           type:profile.provider
         }).then(function(){
           done(null,chef.get());
         })
       }else{
         //signup failed
         done(null,false,{message:'You already signed up with this e-mail address. Please login.'})
       }
     });
   }
 });
}));


// View Signup Page
router.get("/signup", function(req, res){
        res.render('chefs/signup');
});

// Post Signup
router.post("/signup", function(req, res){
    db.chef.create({
      name: req.body.name,
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
// facebook login
router.get('/login/:provider',function(req,res){
 passport.authenticate(
   req.params.provider,
   {scope:['public_profile','email']}
 )(req,res);
});

// facebook callback
router.get('/callback/:provider',function(req,res){
 passport.authenticate(req.params.provider,function(err,chef,info){
  console.log('chef', chef);
   if(err) throw err;
   if(chef){
    req.session.chef = chef.id;
    // console.log('**********',chef.id)
     req.login(chef,function(err){
       if(err) throw err;
       req.flash('success','You are now logged in.');
       res.redirect('/chefs/' + chef.id + '/plates/new')
     });
   }else{
     var errorMsg = info && info.message ? info.message : 'Unknown error';
     console.log('******************', errorMsg);
     req.flash('danger',errorMsg);
     res.redirect('login')
   }
 })(req,res);
});

// Post Login
router.post("/login", function(req, res){

    passport.authenticate(
   'local',
   {badRequestMessage:'You must enter e-mail and password.'},
   function(err,chef,info){
     if(chef){
      req.session.chef = chef.id;
       req.login(chef,function(err){
         if(err) throw err;
         req.flash('success','You are now logged in.');
         // console.log('*************',chef.id)
         // console.log('***********providerchef',providerChef.chefId)
         res.redirect('/chefs/' + chef.id + '/plates/new');
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
        console.log('**************',req.session.chef)



        res.render('chefs/new', {chefId:id, cloudName:process.env.CLOUDINARY_CLOUD_NAME,
         preset:process.env.CLOUDINARY_UPLOAD_PRESET
        });

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

console.log('I am in test mode');
console.log(req.session.chef);

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

  db.patron.findAll().then(function(patron){
    for(var i = 0; i < patron.length; i++) {

    console.log(patron[i].phone);
      var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      client.messages.create({

        to: patron[i].phone,
        from: "+13852824298",
        body: "MESA Special of the Week from The World of Craziness",
        mediaUrl: "http://res.cloudinary.com/dpqunwmnb/image/upload/v1439833856/v8psjfasvnpzw9atlpjl.jp",
      }, function(err, message) {
        console.log(message.sid, err);
      });
    };
  });

    res.render('plates/index', {chefId:1});
});






// var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// client.messages.create({
//   to: "2062286840",
//   from: "+13852824298",
//   body: "MESA Special of the Week from Bobby Flay",
//   mediaUrl: "http://res.cloudinary.com/dpqunwmnb/image/upload/v1439833856/v8psjfasvnpzw9atlpjl.jpg",
// }, function(err, message) {
//   console.log(message.sid, err);
// });


//         var id = req.params.id;
//         res.render('plates/index', {chefId:id});
// });


function waitForAllUploads(id,err,image){
   uploads[id] = image;
   var ids = Object.keys(uploads);
   if (ids.length==6){
     console.log();
     console.log ('**  uploaded all files ('+ids.join(',')+') to cloudinary');
     performTransformations();
   }
 }

//  var processPhoneNumbers = function(callback) {

//   fetchData(function(data) {
//     db.patron.findAll().then(function(patron){
//     for(var i = 0; i < patron.length; i++) {
//       var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//       client.messages.create({
//         to: patron[i].phone,
//         from: "+13852824298",
//         body: "MESA Special of the Week from The World of Craziness",
//         mediaUrl: "http://res.cloudinary.com/dpqunwmnb/image/upload/v1439833856/v8psjfasvnpzw9atlpjl.jp",
//       }, function(err, message) {
//         console.log(message.sid, err);
//       });
//     };
//   });
// });
// };





























module.exports = router;