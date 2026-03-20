const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// นำเข้า Models (เพื่อให้ Sequelize รู้จักตารางตอน sync)
const User = require('./models/User');
const Menu = require('./models/Menu');
const { Order, OrderItem } = require('./models/Order');

const app = express();

// --- 1. Middleware (ต้องเรียงลำดับแบบนี้เป๊ะๆ) ---
app.use(cors({
  origin: ['http://localhost:5173','http://20.24.17.205'], // อนุญาตเฉพาะหน้าเว็บ Vite ของคุณ
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// --- 2. Routes ---
const authRouter = require('./routes/auth');
const menuRouter = require('./routes/menu');
const ordersRouter = require('./routes/orders');

app.use('/api/auth', authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/orders', ordersRouter);

// --- 3. API สำหรับ Orders (เพิ่มต่อจากตรงนี้) ---

// ดึง Order ทั้งหมด
// app.get('/api/orders', async (req, res) => {
//   try {
//     const orders = await Order.findAll({
//       include: [{ model: OrderItem, as: 'items' }],
//       order: [['createdAt', 'DESC']]
//     });
//     res.json(orders);
//   } catch (err) {
//     console.error('Fetch Orders Error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// --- 4. เชื่อมต่อฐานข้อมูลและเริ่ม Server ---
const PORT = 5001;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to SQL Server on Azure!');
    // sync() เฉยๆ เพราะเราสร้างตารางด้วย SQL ไปแล้ว
    return sequelize.sync(); 
  })
  .then(() => {
    console.log('✅ Database synchronized.');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
  });