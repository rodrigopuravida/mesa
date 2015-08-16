'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   queryInterface.addColumn(
  'plates',
  'chefId', {
  type: Sequelize.INTEGER
    });
  },

  down: function (queryInterface, Sequelize) {
   queryInterface.removeColumn('plates','chefId');
 }
};
