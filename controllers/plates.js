var express = require('express');
var router = express.Router();
var request = require('request');
var db = require("../models");
var twilio = require('twilio');

// View Today's Plates
router.get("/new", function(req, res){
  db.plate.findAll().then(function(plate){
     res.render('plates/new', {taco: plate});
  })
});

// View Trending Plates
// router.get("/trending", function(req, res){
//         res.render('plates/trending');
// });

// View Plates From Favorited Chefs
router.get("/mychefs", function(req, res){
  if(req.currentUser){

  db.user.find({
    where: {id: req.currentUser.id}
  }).then(function(user) {
    user.getChefs({include: [db.plate]}).then(function(chefs){
    plates = [];
    chefs.forEach(function(chef) {
      plates.push(chef.plates[0]);
    });
    res.render('plates/mychefs', {plates: plates})
    })
  })
}else{
  req.flash("danger", "Please login to view chefs and see their plates.");
  res.redirect('/auth/login');
}
});

// View Individual Plate
router.get("/:id/show", function(req, res){
  var id = req.params.id
  db.plate.findById(id).then(function(plate){
            res.render('plates/show', {myPlate: plate});
          });
});

//Twilio Post
router.post("/:id/show", function(req, res){
 var id = req.params.id
 db.plate.findById(id).then(function(plate){
 db.chef.find({
   where: {id: plate.chefId},
      include:[db.user]
}).then(function(chef){
   chef.getPatrons().then(function(patrons) {
     for(var i = 0; i < patrons.length; i++) {
       console.log(patrons[i].phone);
       console.log(patrons[i].id);
       console.log(plate.photo);
       if(patrons[i].phone){
       var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
       client.messages.create({
              to: patrons[i].phone,
              from: "+13852824298",
              body: "MESA Special of the Week from Chef " +  chef.user.name,
              mediaUrl: plate.photo
              }, function(err, message) {
              console.log(message.sid, err);
        });

       }
   }
     res.render('plates/show', {myPlate:id});
   })
 })
})
});

module.exports = router;