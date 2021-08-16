'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('users', {
      fields: ['email'],
      type: 'unique',
      validate: {
        isEmail: true,
        msg: "Email format is invalid"
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('users', {
      fields: ['email'],
    })
  }
};
