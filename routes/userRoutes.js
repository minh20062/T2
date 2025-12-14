const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// ✅ GET ALL USERS (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: "Lấy danh sách Users thành công (Admin only)",
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /me (User tự xem profile)
router.get('/me', protect, async (req, res) => {
  res.status(200).json({
    message: "Lấy thông tin cá nhân thành công",
    data: req.user
  });
});

// ✅ GET USER BY ID (Admin only)
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy User" });

    res.status(200).json({ data: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ UPDATE USER (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
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

// ✅ DELETE USER (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
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