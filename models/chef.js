'use strict';
module.exports = function(sequelize, DataTypes) {
  var chef = sequelize.define('chef', {
    name: DataTypes.STRING,
    rest_name: DataTypes.STRING,
    rest_location: DataTypes.STRING,
    chef_bio: DataTypes.TEXT,
    chef_photo: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return chef;
};