const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('CanteenDB', 'sa', 'SQL_2003', {
  host: '10.0.0.4', // <-- วาง Public IP ของ Azure ตรงนี้
  dialect: 'mssql',
  port: 1433,
  dialectOptions: {
    options: {
      encrypt: true, 
      trustServerCertificate: true // เพื่อข้ามการเช็ค SSL certificate ของตัวเครื่อง VM
    }
  },
  logging: false // ปิด log query ยาวๆ ใน console (ถ้าต้องการดูให้เปลี่ยนเป็น true)
});

module.exports = sequelize;