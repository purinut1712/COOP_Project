// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'รอทำ' }
}, {
  tableName: 'Orders' // 🚨 ระบุชื่อตารางให้ชัดเจน
});

const OrderItem = sequelize.define('OrderItem', {
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  menuId: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT },
  quantity: { type: DataTypes.INTEGER }
}, {
  tableName: 'OrderItems' // 🚨 ระบุชื่อตารางให้ชัดเจน
});

// สร้างความสัมพันธ์ (เช็คตัวสะกด as: 'items' ให้ดี)
Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = { Order, OrderItem };