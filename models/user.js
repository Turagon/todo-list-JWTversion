'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: async (User, next) => {
        const password = User.dataValues.password
        try {
          const salt = await bcrypt.genSalt(10)
          User.dataValues.password = await bcrypt.hash(password, salt)
        }
        catch (error) {
          console.log(error)
        }
      }
    },
    sequelize
  });
  return User;
};
