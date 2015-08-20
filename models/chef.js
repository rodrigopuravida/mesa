'use strict';
module.exports = function(sequelize, DataTypes) {
  var chef = sequelize.define('chef', {
    restaurant: DataTypes.STRING,
    location: DataTypes.STRING,
    bio: DataTypes.STRING,
    photo: DataTypes.STRING,
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