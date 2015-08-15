'use strict';
module.exports = function(sequelize, DataTypes) {
  var plate = sequelize.define('plate', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
      },
    description: {
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
    deal: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return plate;
};