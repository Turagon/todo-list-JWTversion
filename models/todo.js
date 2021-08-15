'use strict';
const {
  Model
} = require('sequelize');
const User = require('./user');//這行不知道在做甚麼?
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      Todo.belongsTo(models.User)
    }
  };
  Todo.init({
    name: DataTypes.STRING,
    isDone: DataTypes.BOOLEAN,
    dueDate: DataTypes.DATE,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};