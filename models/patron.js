'use strict';
module.exports = function(sequelize, DataTypes) {
  var patron = sequelize.define('patron', {
email: {
      type: DataTypes.STRING,
      validate: {
        isEmail:true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len:[4,12],
        notEmpty: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
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
    hooks: {
      beforeCreate: function(user, options, callback){
        if(user.password){
          bcrypt.hash(user.password,10,function(error,hash){
            if(error) return callback(error);
            user.password = hash;
            callback(null, user);
          });
        }else{
          callback(null, user);
        }
      }
    }
  });
  return patron;
};