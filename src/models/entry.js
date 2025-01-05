// models/entry.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Category = require('./category'); // Import Category model

const Entry = sequelize.define('Entry', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0,
  },
  artist: {
    type: DataTypes.STRING,
  },
  duration: {
    type: DataTypes.STRING,
  },
  colorOptions: {
    type: DataTypes.TEXT,
  },
  materials: {
    type: DataTypes.TEXT,
  },
  aftercare: {
    type: DataTypes.TEXT,
  },
  allergyWarnings: {
    type: DataTypes.TEXT,
  },
  availability: {
    type: DataTypes.STRING,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Ensures a categoryId is always set
    references: {
      model: Category,  // Reference the Category table
      key: 'id',        // Reference the `id` field in Category table
    },
  },
}, {
  tableName: 'Entries',
});

// Establish the relationship
Entry.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = Entry;
