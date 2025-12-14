const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ CREATE USER
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    newUser.password = undefined;
    res.status(201).json({
      message: "Tạo User thành công!",
      data: newUser
    });
  } catch (err) {
    res.status(400).json({
      message: "Tạo User thất bại",
      error: err.message
    });
  }
});

// ✅ READ ALL USERS
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ ONE USER
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Không tìm thấy User" });

    res.status(200).json({ data: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ UPDATE USER
router.put('/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy User để cập nhật" });

    res.status(200).json({
      message: "Cập nhật thành công",
      data: updated
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE USER
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy User để xóa" });

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;