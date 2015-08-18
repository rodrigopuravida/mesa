'use strict';
module.exports = function(sequelize, DataTypes) {
  var providerChef = sequelize.define('providerChef', {
    pid: DataTypes.STRING,
    token: DataTypes.STRING,
    type: DataTypes.STRING,
    chefId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.providerChef.belongsTo(models.chef);
      }
    }
  });
  return providerChef;
};