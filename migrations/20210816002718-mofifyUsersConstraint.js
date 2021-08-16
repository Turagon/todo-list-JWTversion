'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('users', {
      fields: ['email'],
      type: 'unique',
      name: 'email'
    })
  },

  down: async (queryInterface, Sequelize) => {
   
  }
};
