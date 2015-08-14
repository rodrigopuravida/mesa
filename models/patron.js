'use strict';
module.exports = function(sequelize, DataTypes) {
  var patron = sequelize.define('patron', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return patron;
};