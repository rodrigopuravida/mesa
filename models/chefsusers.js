'use strict';
module.exports = function(sequelize, DataTypes) {
  var chefsUsers = sequelize.define('chefsUsers', {
    userId: DataTypes.INTEGER,
    chefId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return chefsUsers;
};