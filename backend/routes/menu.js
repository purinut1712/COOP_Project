// routes/menu.js
const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu'); // ตรวจสอบว่า Path ถูกต้อง

// 1. GET all menus
router.get('/', async (req, res) => {
  try {
    // เปลี่ยนจาก Menu.find() เป็น Menu.findAll()
    const menus = await Menu.findAll();
    res.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ message: 'Error fetching menus', error: error.message });
  }
});

// 2. POST new menu
router.post('/', async (req, res) => {
  try {
    const { name, price, image } = req.body;
    if (!name || !price || !image) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    // เปลี่ยนจาก new Menu(...).save() เป็น Menu.create(...)
    const menu = await Menu.create({ name, price, image });
    console.log('Menu saved successfully:', menu);
    res.json(menu);

  } catch (error) {
    console.error('Menu save FAILED:', error);
    res.status(500).json({ message: 'Error saving menu', error: error.message });
  }
});

// 3. DELETE menu
router.delete('/:id', async (req, res) => {
  try {
    // เปลี่ยนจาก Menu.findByIdAndDelete เป็น Menu.destroy
    await Menu.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Menu deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu', error: error.message });
  }
});

module.exports = router;