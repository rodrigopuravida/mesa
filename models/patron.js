'use strict';
module.exports = function(sequelize, DataTypes) {
 var chef = sequelize.define('chef', {
   name: {
     type: DataTypes.STRING,
     validate: {
       notEmpty: true
     }
   },
   rest_name: {
     type: DataTypes.STRING,
     validate: {
       notEmpty: true
     }
   },
   rest_location: {
     type: DataTypes.STRING,
     validate: {
       notEmpty: true
     }
   },
   chef_bio: {
     type: DataTypes.TEXT,
     validate: {
       notEmpty: true
     }
   },
   chef_photo: {
     type: DataTypes.STRING,
     validate: {
       notEmpty: true
     }
   },
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
   phone: DataTypes.STRING
 }, {
   classMethods: {
     associate: function(models) {
       models.chef.belongsToMany(models.patron, {through: "chefsPatrons"});
     },
     authenticate: function(email,password,callback){
       this.find({where:{email:email}}).then(function(chef){
         if(chef){
           bcrypt.compare(password,chef.password,function(error,result){
             if(error){
               callback(error);
             }else{
               callback(null, result ? chef : false);
             }
           });
         }else{
           callback(null, false);
         }
       }).catch(callback);
     }
   }
   // hooks: {
   //   beforeCreate: function(chef, options, callback){
   //     if(chef.password){
   //       bcrypt.hash(chef.password,10,function(error,hash){
   //         if(error) return callback(error);
   //         chef.password = hash;
   //         callback(null, chef);
   //       });
   //     }else{
   //       callback(null, chef);
   //     }
   //   }
   // }
 });
 return chef;
};

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
       models.patron.belongsToMany(models.chef, {through: "chefsPatrons"});
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
   }
   // hooks: {
   //   beforeCreate: function(user, options, callback){
   //     if(user.password){
   //       bcrypt.hash(user.password,10,function(error,hash){
   //         if(error) return callback(error);
   //         user.password = hash;
   //         callback(null, user);
   //       });
   //     }else{
   //       callback(null, user);
   //     }
   //   }
   // }
 });
 return patron;
};