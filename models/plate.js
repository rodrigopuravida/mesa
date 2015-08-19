'use strict';
module.exports = function(sequelize, DataTypes) {
  var plate = sequelize.define('plate', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    photo: DataTypes.STRING,
    deal: DataTypes.STRING,
    chefId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.plate.belongsTo(models.chef);
      }
    }
  });
  return plate;
};