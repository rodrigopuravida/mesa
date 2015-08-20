// var dotenv = require('dotenv');
// dotenv.load();
var express = require('express');
var router = express.Router();
var request = require('request');
var db = require("../models");
var twilio = require('twilio');


// View Today's Plates
router.get("/new", function(req, res){
  db.plate.find({
    where: {}
  })
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
// db.chef.findAll({
//   include: [{
//         model: user,
//         where:  {userId: req.user.id}
//     }]
//   }).then(function(chefsUsers){
//   console.log('************chefsUsers',chefsUsers)
// })

// db.user.find({
//   where:{id:req.currentUser.id},
//   include:[{
//     model:db.chef,
//     include:[{
//       model:db.user,
//       as:'patrons'
//     }]
//   }]
// }).then(function(user){
//     res.send(user.chef.patrons)
//   })

// db.plate.findById(1).then(function(plate){
//   db.chef.find({
//     where: {id: plate.chefId},
//        include:[{
//       model:db.user,
//       as:'patrons'
//        }]
// }).then(function(chef){
//     res.send(chef.patrons)

//   })
// })

db.plate.findById(1).then(function(plate){
  db.chef.find({
    where: {id: plate.chefId},
       include:[db.user]
}).then(function(chef){
    chef.getPatrons().then(function(patrons) {
      res.send(patrons);
    })
  })
})


  // db.chefsUsers.findAll({
  //   include: [db.user],
  //   where: {userId: req.currentUser.id}
  // }).then(function(chefsUsers){
  //   res.send(chefsUsers)
  // })

  // db.user.findById(req.user.id).then(function(user){
  //   console.log('****************user',user)
  //   db.chefsUsers({
  //     where: {userId: user.id}
  //   })
  //   })
  // // })
  //       res.render('plates/following');
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
 db.plate.findById(1).then(function(plate){
 db.chef.find({
   where: {id: plate.chefId},
      include:[db.user]
}).then(function(chef){
   chef.getPatrons().then(function(patrons) {
    // var phoneNumbers = [];
     for(var i = 0; i < patrons.length; i++) {
       console.log(patrons[i].phone);
       console.log(patrons[i].id);
       console.log(plate.photo);

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
     res.render('plates/show', {myPlate:id});
   })
 })
})
});


module.exports = router;