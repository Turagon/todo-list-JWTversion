'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'users', 'email', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          msg: "Email format is invalid"
        }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'users', 'email', {
      validate: {
        isEmail: true,
        msg: "Email format is invalid"
      }
    })
  }
};
