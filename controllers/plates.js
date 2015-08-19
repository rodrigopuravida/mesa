// var dotenv = require('dotenv');
// dotenv.load();
var express = require('express');
var router = express.Router();
var request = require('request');
var db = require("../models");
var twilio = require('twilio');


// View Today's Plates
router.get("/new", function(req, res){
        res.render('plates/new');
});


//Test Twilio Route
router.get("/test", function(req, res) {

console.log('I am in test mode');

  var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
client.messages.create({
  to: "2062146817",
  from: "+13852824298",
  body: "MESA Special of the Week from Bobby Flay",
  mediaUrl: "http://res.cloudinary.com/dpqunwmnb/image/upload/v1439833856/v8psjfasvnpzw9atlpjl.jpg",
}, function(err, message) {
  console.log(message, err);
});

res.render('plates/new');

});

// View Trending Plates
router.get("/trending", function(req, res){
        res.render('plates/trending');
});

// View Plates From Favorited Chefs
router.get("/mychefs", function(req, res){
        res.render('plates/following');
});

// View Individual Plate -- This will not work until we pass information (params :id) in.
router.get("/:id/show", function(req, res){
        res.render('plates/show');
});

module.exports = router;
