'use strict';
var bcrypt = require('bcrypt');
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    isChef: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        models.user.belongsToMany(models.chef, {through: 'chefsUsers'});
        models.user.hasMany(models.provider);
      },
      authenticate: function(email,password,callback){
      this.find({where:{email:email}}).then(function(user){
        if(user){
          bcrypt.compare(password,user.password,function(error,result){
            if(error){
              callback(error);
            }else{
              callback(null, result ? user : false);
            }
          });
        }else{
          callback(null, false);
        }
      }).catch(callback);
    }
  },
   instanceMethods: {
     checkPassword: function(pass,callback){
       if(pass && this.password){
         bcrypt.compare(pass,this.password,callback);
       }else{
         callback(null,false);
       }
     }
   },
  hooks: {
    beforeCreate: function(chef, options, callback){
      if(chef.password){
        bcrypt.hash(chef.password,10,function(error,hash){
          if(error) return callback(error);
          chef.password = hash;
          callback(null, chef);
        });
      }else{
        callback(null, chef);
      }
    }
    }
  });
  return user;
};