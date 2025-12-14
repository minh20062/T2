const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// ✅ GET ALL USERS (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
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

// PUT /api/v1/users/me
router.put('/me', protect, async (req, res) => {
  try {
    // Chỉ cho phép sửa profile, không cho sửa role, password, email
    const { profile } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profile: profile },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: "Cập nhật hồ sơ thành công",
      data: updatedUser
    });
  } catch (err) {
    res.status(400).json({ message: "Cập nhật thất bại", error: err.message });
  }
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