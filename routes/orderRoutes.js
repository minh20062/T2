const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/authMiddleware');

// ✅ 1. Tạo đơn hàng
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    const newOrder = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress
    });

    res.status(201).json({ message: "Đặt hàng thành công", data: newOrder });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ 2. Xem đơn hàng của tôi
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('user', 'username email')
      .populate('items.product')
      .sort('-createdAt');

    res.status(200).json({ count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 3. Admin xem tất cả đơn hàng
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .populate('items.product')
      .sort('-createdAt');

    res.status(200).json({ count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;