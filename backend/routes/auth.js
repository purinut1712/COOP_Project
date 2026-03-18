const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    await User.create({ username, password, role });
    res.json({ message: 'Register success' });
  } catch (error) {
    res.status(400).json({ message: 'Error or Username exists' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (!user || password !== user.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    username: user.username,
    role: user.role,
    userId: user.id // เปลี่ยนจาก user._id เป็น user.id
  });
});

module.exports = router;