const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure no duplicate categories
    validate: {
      notEmpty: true, // Ensure the name is not empty
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false, // Description is optional
  },
}, {
  tableName: 'Categories',
});

module.exports = Category;