var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var ejsLayouts = require('express-ejs-layouts');
var request = require('request');
var db = require('./models');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


var NODE_ENV = process.env.NODE_ENV || 'development';
var BASE_URL =  (NODE_ENV === 'production') ? 'https://enlamesa.herokuapp.com' : 'http://localhost:3000';

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(ejsLayouts);

app.use(express.static(__dirname + '/public'));

app.use(session({
    secret:'lskdfjlasjdlfjlsdjflkdsjfksdjljlk',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  // req.session.user = 6;
  if(req.session.user){
    db.user.findById(req.session.user).then(function(user){
    req.currentUser = user
    next();
  });
  }else{
    req.currentUser = false;
    next();
  }
});

app.use(flash());
app.use(function(req,res,next){
    app.locals.currentUser = req.user;
    res.locals.alerts = req.flash();
    next();
});

// Serialize User
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//Deserialize User
passport.deserializeUser(function(id, done) {
    db.user.findById(id).then(function(user) {
    done(null, user.get());
    }).catch(done);
});

// Passport-Local Auth Strategy
passport.use(new LocalStrategy({
    usernameField:'email'
    }, function(email,password,done){
        db.user.find({where:{email:email}}).then(function(user){
        if(user){
          user.checkPassword(password,function(err,result){
        if(err) return done(err);
        if(result){
          done(null,user.get());
        }else{
          done(null,false,{message: 'Invalid Password.'});
        }
        });
        }else{
          done(null,false,{message: 'Unknown user. Please sign up.'});
        }
    });
    }
));

// Passport-Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: BASE_URL + '/auth/callback/facebook/',
  profileFields: ['email','displayName'],
  enableProof: true
  },function(accessToken, refreshToken, profile, done){
    db.provider.find({
        where:{
                pid:profile.id,
                type:profile.provider
        },
        include:[db.user]
  }).then(function(provider){
    if(provider && provider.user){
      provider.token = accessToken;
      provider.save().then(function(){
      done(null,provider.user.get());
      });
      }else{
      var email = profile.emails[0].value;
      db.user.findOrCreate({
      where:{email:email},
      defaults:{email:email,name:profile.displayName}
      }).spread(function(user,created){
          if(created){
              user.createProvider({
              pid:profile.id,
              token:accessToken,
              type:profile.provider
          }).then(function(){
              done(null,user.get());
          })
          }else{
              done(null,false,{message:'You already signed up to Mesa with this email. Please login!'})
          }
      });
      }
  });
}));

// Home
app.get('/', function(req, res){
         res.render('index', {currentUser: req.user});
});

//Controllers
app.use('/auth', require('./controllers/auth.js'));
app.use('/users', require('./controllers/users.js'));
app.use('/chefs',require('./controllers/chefs.js'));
app.use('/plates',require('./controllers/plates.js'));


app.listen(process.env.PORT || 3000)