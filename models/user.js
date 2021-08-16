'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Todo)
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Invalid email format'
        }
      }
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
