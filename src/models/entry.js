const { DataTypes } = require('sequelize');
const sequelize = require('../db');

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
    allowNull: true,
    references: {
      model: 'Categories', // Use table name as a reference
      key: 'id',
    },
  },
}, {
  tableName: 'Entries',
});

module.exports = Entry;
