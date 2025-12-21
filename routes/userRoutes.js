const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { upload, uploadToCloudinary } = require('../utils/cloudinary');

// ✅ Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// ✅ GET ALL USERS (Admin only)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
});

// ✅ GET /me (User tự xem profile)
router.get('/me', protect, async (req, res) => {
  res.status(200).json({
    message: "Lấy thông tin cá nhân thành công",
    data: req.user
  });
});

// ✅ UPDATE PROFILE (User)
router.put('/me', protect, async (req, res, next) => {
  try {
    const { profile } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profile },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: "Cập nhật hồ sơ thành công",
      data: updatedUser
    });
  } catch (err) {
    next(err);
  }
});

// ✅ GET USER BY ID (Admin only)
router.get('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("Không tìm thấy User");
    }

    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
});

// ✅ UPDATE USER (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      res.status(404);
      throw new Error("Không tìm thấy User để cập nhật");
    }

    res.status(200).json({
      message: "Cập nhật thành công",
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// ✅ DELETE USER (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      res.status(404);
      throw new Error("Không tìm thấy User để xóa");
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// ✅ UPLOAD AVATAR
router.post('/upload-avatar', protect, upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Chưa chọn file ảnh');
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const user = await User.findById(req.user._id);
    user.profile.avatarUrl = result.secure_url;
    await user.save({ validateBeforeSave: false });

    res.json({
      message: 'Upload thành công',
      avatarUrl: result.secure_url
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;