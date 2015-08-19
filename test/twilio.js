var db = require("../models");

  var patronNumbers = [];
var processPhoneNumbers = function() {
        db.patron.findAll().then(function(patron){
                for(var i = 0; i < patron.length; i++){
                        patronNumbers.push(patron[i].phone)
                }
        }).then(function(patron){
              console.log('***** console log inside promise', patronNumbers) ;
        });
        console.log('after promise ',patronNumbers);
  }

console.log(processPhoneNumbers());

// console.log( getData(processPhoneNumbers));

//  db.patron.findAll().then(function(patron){
//    for(var i = 0; i < patron.length; i++) {
//         console.log(patron.phone)
//      patronNumbers.push(patron[i].phone)
//    };
//      return patronNumbers;
// });