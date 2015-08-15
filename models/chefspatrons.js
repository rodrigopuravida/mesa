'use strict';
module.exports = function(sequelize, DataTypes) {
  var chefsPatrons = sequelize.define('chefsPatrons', {
    chefId: DataTypes.INTEGER,
    patronId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return chefsPatrons;
};