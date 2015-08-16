'use strict';
var bcrypt = require('bcrypt');
module.exports = function(sequelize, DataTypes) {
 var patron = sequelize.define('patron', {
email: {
     type: DataTypes.STRING,
     validate: {
       isEmail:true
     }
   },
   phone: {
     type: DataTypes.STRING,
     validate: {
       notEmpty: true
     }
   },
   password: {
     type: DataTypes.STRING,
     validate: {
       len:[4,12],
       notEmpty: true
     }
   }
 }, {
   classMethods: {
     associate: function(models) {
       models.patron.belongsToMany(models.chef, {through: "chefsPatrons"});
     },
     authenticate: function(email,password,callback){
       this.find({where:{email:email}}).then(function(patron){
         if(patron){
           bcrypt.compare(password,patron.password,function(error,result){
             if(error){
               callback(error);
             }else{
               callback(null, result ? patron : false);
             }
           });
         }else{
           callback(null, false);
         }
       }).catch(callback);
     }
   },
   hooks: {
     beforeCreate: function(patron, options, callback){
       if(patron.password){
         bcrypt.hash(patron.password,10,function(error,hash){
           if(error) return callback(error);
           patron.password = hash;
           callback(null, patron);
         });
       }else{
         callback(null, patron);
       }
     }
   }
 });
 return patron;
};