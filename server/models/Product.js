const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 }
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  image_url: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  brand: {
    type: DataTypes.STRING(100),
    defaultValue: null
  },
  volume: {
    type: DataTypes.STRING(50),
    defaultValue: null // '50ml', '100ml', '200ml'
  },
  fragrance_type: {
    type: DataTypes.STRING(100),
    defaultValue: null // 'Eau de Parfum', 'Eau de Toilette'
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating_avg: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0
  },
  rating_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true
});

module.exports = Product;
