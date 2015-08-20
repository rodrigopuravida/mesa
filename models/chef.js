'use strict';
module.exports = function(sequelize, DataTypes) {
  var chef = sequelize.define('chef', {
    restaurant: {
     type: DataTypes.STRING,
     validate: {
       notEmpty: true
     }
   },
    location: {
     type: DataTypes.STRING,
     validate: {
       notEmpty: true
     }
   },
    bio: {
     type: DataTypes.STRING,
     validate: {
       notEmpty: true
     }
   },
    photo: {
     type: DataTypes.STRING,
     validate: {
       notEmpty: true
     }
   },
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // models.chef.belongsToMany(models.user, {through: 'chefsUsers'});
        models.chef.belongsTo(models.user);
        models.chef.hasMany(models.plate);
        models.chef.belongsToMany(models.user, {through: 'chefsUsers'});
      }
    }
  });
  return chef;
};