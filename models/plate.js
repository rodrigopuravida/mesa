'use strict';
module.exports = function(sequelize, DataTypes) {
  var plate = sequelize.define('plate', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    photo: DataTypes.STRING,
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