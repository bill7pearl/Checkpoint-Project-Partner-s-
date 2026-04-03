const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending_payment',
    validate: {
      isIn: [['pending_payment', 'processing', 'shipped', 'delivered', 'cancelled']]
    }
  },
  shipping_address: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  billing_address: {
    type: DataTypes.JSONB,
    defaultValue: null
  },
  payment_method: {
    type: DataTypes.STRING(50),
    defaultValue: 'cod'
  },
  is_paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paid_at: {
    type: DataTypes.DATE,
    defaultValue: null
  }
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true
});

module.exports = Order;
