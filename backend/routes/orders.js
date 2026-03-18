const express = require('express');
const router = express.Router();
const { Order, OrderItem } = require('../models/Order');
const sequelize = require('../config/database');

// GET - ประวัติของลูกค้า (สำคัญที่สุดสำหรับปัญหานี้)
router.get('/customer/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ message: 'userId ไม่ถูกต้อง' });
    }

    console.log(`[DEBUG] กำลังดึง orders ของ userId = ${userId}`);

    const orders = await Order.findAll({
      where: { userId },
      include: [{
        model: OrderItem,
        as: 'items'
      }],
      order: [['createdAt', 'DESC']]
    });

    console.log(`[DEBUG] พบ orders จำนวน ${orders.length} รายการ`);

    res.json(orders);
  } catch (error) {
    console.error('[ERROR] Fetch customer orders:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล', error: error.message });
  }
});

// POST - สร้าง order ใหม่ (ใช้ transaction)
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน (ต้องการ userId และ items)' });
    }

    const order = await Order.create(
      { userId, status: 'รอทำ' },
      { transaction: t }
    );

    const itemsToCreate = items.map(item => ({
      orderId: order.id,
      menuId: item.menuId,
      name: item.name,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity, 10)
    }));

    await OrderItem.bulkCreate(itemsToCreate, { transaction: t });

    await t.commit();

    // ส่งข้อมูล order ที่สร้างใหม่กลับไป (รวม items)
    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    res.status(201).json(fullOrder);
  } catch (error) {
    await t.rollback();
    console.error('[ERROR] Create order:', error);
    res.status(500).json({ message: 'ไม่สามารถสร้างคำสั่งซื้อได้', error: error.message });
  }
});

// GET - ดึง orders ทั้งหมด (สำหรับ admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error('[ERROR] Fetch all orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT - อัปเดตสถานะ (ใช้ได้ทั้ง admin และอาจขยายในอนาคต)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const [updated] = await Order.update(
      { status },
      { where: { id: req.params.id } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: 'ไม่พบคำสั่งซื้อ' });
    }

    res.json({ message: 'อัปเดตสถานะสำเร็จ' });
  } catch (error) {
    console.error('[ERROR] Update order status:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;